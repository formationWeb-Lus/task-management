/**
 * Component: TimeScreen
 * Description: Screen responsible for tracking time spent on tasks using an interactive stopwatch.
 * Features: Play/Pause toggling, precise interval tracking with elapsed time accumulation,
 * timer reset, and bottom tab navigation.
 */

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TimeScreen() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  /** Total elapsed time counter measured in seconds */
  const [seconds, setSeconds] = useState(0);

  /** Active state of the stopwatch (true = running, false = paused) */
  const [running, setRunning] = useState(false);

  // ==========================================
  // REFS (PERSISTENT VALUES ACROSS RENDERS)
  // ==========================================

  /** Timestamp (in ms) recording when the active timer session started */
  const startTimeRef = useRef<number | null>(null);

  /** Holds accumulated seconds from previous active sessions to prevent drift on pause/resume */
  const accumulatedTimeRef = useRef<number>(0);

  // ==========================================
  // TIMER EFFECT LOGIC
  // ==========================================

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (running) {
      // Capture start timestamp when timer is activated
      startTimeRef.current = Date.now();

      // Recalculate elapsed seconds every second to ensure accuracy
      interval = setInterval(() => {
        if (startTimeRef.current) {
          const elapsedSeconds = Math.floor(
            (Date.now() - startTimeRef.current) / 1000,
          );
          setSeconds(accumulatedTimeRef.current + elapsedSeconds);
        }
      }, 1000);
    } else {
      // Save total elapsed seconds when paused
      accumulatedTimeRef.current = seconds;
    }

    // Cleanup interval listener when component unmounts or status changes
    return () => clearInterval(interval);
  }, [running]);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  /** Toggles the stopwatch between running and paused states */
  const toggleTimer = () => {
    setRunning((prev) => !prev);
  };

  /** Stops the stopwatch and resets all stored time values to zero */
  const resetTimer = () => {
    setRunning(false);
    setSeconds(0);
    accumulatedTimeRef.current = 0;
  };

  /**
   * Formats raw seconds into a double-digit HH:MM:SS string.
   * @returns Formatted time string (e.g., "01:15:30")
   */
  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* ================= MAIN CONTENT ================= */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title Section */}
          <Text style={styles.title}>Time Tracking</Text>
          <Text style={styles.subtitle}>Track the time spent on your task</Text>

          {/* Central Circular Stopwatch Display */}
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime()}</Text>
          </View>

          {/* Main Action: Start / Pause Toggle */}
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={toggleTimer}
          >
            <Ionicons
              name={running ? "pause" : "play"}
              size={20}
              color="#08192D"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>{running ? "Pause" : "Start"}</Text>
          </Pressable>

          {/* Secondary Action: Reset Timer */}
          <Pressable
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.resetPressed,
            ]}
            onPress={resetTimer}
          >
            <Ionicons
              name="reload-outline"
              size={18}
              color="#08192D"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>

          {/* Back Navigation Button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </ScrollView>

        {/* ================= BOTTOM NAVIGATION BAR ================= */}
        <View style={styles.footer}>
          {/* Navigation Item: Tasks */}
          <Pressable style={styles.footerItem} onPress={() => router.push("/")}>
            <Ionicons name="clipboard-outline" size={22} color="#8993A2" />
            <Text style={styles.footerLabel}>Tasks</Text>
          </Pressable>

          {/* Navigation Item: Add Task */}
          <Pressable
            style={styles.footerItem}
            onPress={() => router.push("/add-task")}
          >
            <Ionicons name="add-circle-outline" size={22} color="#8993A2" />
            <Text style={styles.footerLabel}>Add</Text>
          </Pressable>

          {/* Active Navigation Item: Stats / Time Tracking */}
          <Pressable style={styles.footerItem}>
            <View style={styles.footerIconActive}>
              <Ionicons name="bar-chart" size={22} color="#08192D" />
            </View>
            <Text style={[styles.footerLabel, styles.footerLabelActive]}>
              Stats
            </Text>
          </Pressable>

          {/* Navigation Item: Menu Settings */}
          <Pressable style={styles.footerItem}>
            <Ionicons name="settings-outline" size={22} color="#8993A2" />
            <Text style={styles.footerLabel}>Menu</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// STYLESHEET DEFINITIONS
// ==========================================
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
  },

  /* Header Typography */
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#08192D",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#8993A2",
    textAlign: "center",
    marginTop: 6,
  },

  /* Timer Circle Container */
  timerContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 36,
    elevation: 4,
    shadowColor: "#08192D",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  timer: {
    fontSize: 36,
    fontWeight: "800",
    color: "#08192D",
    fontVariant: ["tabular-nums"], // Keeps digit width uniform to prevent layout jumping
  },

  /* Start/Pause Primary Button */
  startButton: {
    width: "100%",
    backgroundColor: "#F6C945",
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: "#08192D",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Reset Secondary Button */
  resetButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  resetPressed: {
    opacity: 0.6,
  },
  resetText: {
    color: "#08192D",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Back Button */
  backButton: {
    marginTop: 12,
    padding: 8,
  },
  backText: {
    color: "#8993A2",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Bottom Navigation Bar */
  footer: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E9EDF2",
  },
  footerItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerIconActive: {
    backgroundColor: "#FFF3C9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8993A2",
    marginTop: 2,
  },
  footerLabelActive: {
    color: "#08192D",
    fontWeight: "800",
  },
});
