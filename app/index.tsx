import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

/** Local storage key used to persist tasks across sessions */
export const TASKS_STORAGE_KEY = "@task_management_tasks";

type FilterType = "All" | "Urgent" | "Completed";

export type Task = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  urgent: boolean;
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finalize mobile project",
    date: "Today • 6:00 PM",
    completed: false,
    urgent: true,
  },
  {
    id: "2",
    title: "Learn React Native",
    date: "Today • 8:00 PM",
    completed: false,
    urgent: false,
  },
  {
    id: "3",
    title: "Create my mobile app",
    date: "Tomorrow • 10:00 AM",
    completed: true,
    urgent: false,
  },
  {
    id: "4",
    title: "Complete BYU project",
    date: "Tomorrow • 3:00 PM",
    completed: false,
    urgent: false,
  },
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [menuOpen, setMenuOpen] = useState(false);
  const [urgentOpen, setUrgentOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  /** Loads tasks from phone storage when screen gains focus */
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        await AsyncStorage.setItem(
          TASKS_STORAGE_KEY,
          JSON.stringify(initialTasks),
        );
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  /** Saves tasks state to local storage upon updates */
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const shareTasks = async () => {
    try {
      await Share.share({
        message: `I have ${tasks.length} tasks in my Task app.`,
      });
    } catch (error) {
      console.log("Error sharing tasks:", error);
    }
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "Urgent":
        return tasks.filter((task) => task.urgent && !task.completed);
      case "Completed":
        return tasks.filter((task) => task.completed);
      case "All":
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const urgentTasks = filteredTasks.filter(
    (task) => task.urgent && !task.completed,
  );
  const normalTasks = filteredTasks.filter(
    (task) => !task.urgent || task.completed,
  );

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  const changeFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    setMenuOpen(false);

    if (filter === "Urgent") setUrgentOpen(true);
    if (filter === "All") {
      setUrgentOpen(true);
      setTasksOpen(true);
    }
    if (filter === "Completed") setTasksOpen(true);
  };

  const showFilter = () => {
    Alert.alert("Filter Tasks", "Choose a filter to apply", [
      { text: "All", onPress: () => changeFilter("All") },
      { text: "Urgent", onPress: () => changeFilter("Urgent") },
      { text: "Completed", onPress: () => changeFilter("Completed") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* ==================== TOP HEADER ==================== */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.7}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Ionicons
            name={menuOpen ? "close-outline" : "menu-outline"}
            size={27}
            color="#08192d"
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Task</Text>
          <Text style={styles.appSubtitle}>
            {activeFilter === "All"
              ? "Task Manager"
              : `Filter: ${activeFilter}`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              activeFilter !== "All" && styles.filterActiveButton,
            ]}
            activeOpacity={0.7}
            onPress={showFilter}
          >
            <Ionicons
              name="filter-outline"
              size={22}
              color={activeFilter !== "All" ? "#e53935" : "#08192d"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.7}
            onPress={shareTasks}
          >
            <Ionicons name="share-social-outline" size={22} color="#08192d" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================== DROPDOWN MENU ==================== */}
      {menuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => changeFilter("All")}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="list-outline" size={21} color="#08192d" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>All Tasks</Text>
              {activeFilter === "All" && (
                <Text style={styles.activeFilterText}>Active filter</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => changeFilter("Urgent")}
          >
            <View style={[styles.menuIcon, styles.redIcon]}>
              <Ionicons name="alert-circle-outline" size={21} color="#e53935" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Urgent Tasks</Text>
              {activeFilter === "Urgent" && (
                <Text style={styles.activeFilterText}>Active filter</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              router.push("/time");
            }}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="time-outline" size={21} color="#08192d" />
            </View>
            <Text style={styles.menuText}>Track My Time</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => changeFilter("Completed")}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#08192d"
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Completed Tasks</Text>
              {activeFilter === "Completed" && (
                <Text style={styles.activeFilterText}>Active filter</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome greeting section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.heading}>Today</Text>
            <Text style={styles.summary}>
              {activeFilter === "All"
                ? "Here is your activity for today"
                : `${filteredTasks.length} task${
                    filteredTasks.length > 1 ? "s" : ""
                  } displayed`}
            </Text>
          </View>
          <View style={styles.todayIcon}>
            <Ionicons name="calendar-outline" size={25} color="#08192d" />
          </View>
        </View>

        {/* Statistical overview cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="layers-outline" size={20} color="#08192d" />
            </View>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={20} color="#08192d" />
            </View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>To Do</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#08192d"
              />
            </View>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Active filter clear banner */}
        {activeFilter !== "All" && (
          <View style={styles.activeFilterBanner}>
            <View style={styles.activeFilterLeft}>
              <Ionicons
                name={
                  activeFilter === "Urgent"
                    ? "alert-circle-outline"
                    : "checkmark-circle-outline"
                }
                size={18}
                color={activeFilter === "Urgent" ? "#e53935" : "#08192d"}
              />
              <Text style={styles.activeFilterBannerText}>{activeFilter}</Text>
            </View>

            <TouchableOpacity onPress={() => changeFilter("All")}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Urgent Tasks Section */}
        {urgentTasks.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              activeOpacity={0.7}
              onPress={() => setUrgentOpen(!urgentOpen)}
            >
              <View style={styles.sectionTitleRow}>
                <View style={styles.urgentDot} />
                <Text style={styles.urgentTitle}>URGENT</Text>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>
                    {urgentTasks.length}
                  </Text>
                </View>
              </View>

              <Ionicons
                name={
                  urgentOpen ? "chevron-up-outline" : "chevron-down-outline"
                }
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>

            {urgentOpen &&
              urgentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onPress={() => toggleTask(task.id)}
                />
              ))}
          </View>
        )}

        {/* Standard / Completed Tasks Section */}
        {normalTasks.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              activeOpacity={0.7}
              onPress={() => setTasksOpen(!tasksOpen)}
            >
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>
                  {activeFilter === "Completed"
                    ? "COMPLETED TASKS"
                    : "MY TASKS"}
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{normalTasks.length}</Text>
                </View>
              </View>

              <Ionicons
                name={tasksOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>

            {tasksOpen &&
              normalTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onPress={() => toggleTask(task.id)}
                />
              ))}
          </View>
        )}

        {/* Empty State View */}
        {filteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="checkmark-done-outline"
                size={36}
                color="#08192d"
              />
            </View>
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptyText}>
              No tasks match the currently selected filter.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => changeFilter("All")}
            >
              <Text style={styles.emptyButtonText}>View All Tasks</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.85}
        onPress={() => router.push("/add-task")}
      >
        <Ionicons name="add" size={31} color="#08192d" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.footer}>
        <FooterItem icon="home" label="Home" active onPress={() => {}} />
        <FooterItem
          icon="checkmark-done-outline"
          label="Tasks"
          onPress={() => changeFilter("All")}
        />
        <FooterItem
          icon="time-outline"
          label="Time"
          onPress={() => router.push("/time")}
        />
        <FooterItem
          icon="settings-outline"
          label="Settings"
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}

/** Task item component displaying individual task state */
function TaskItem({ task, onPress }: { task: Task; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[
        styles.taskCard,
        task.urgent && styles.urgentCard,
        task.completed && styles.completedCard,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted,
          task.urgent && !task.completed && styles.checkboxUrgent,
        ]}
      >
        {task.completed && (
          <Ionicons name="checkmark" size={16} color="#ffffff" />
        )}
      </View>

      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskTitle, task.completed && styles.taskCompleted]}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color="#8a93a1" />
          <Text style={styles.taskDate}>{task.date}</Text>
        </View>
      </View>

      {task.urgent && !task.completed && (
        <View style={styles.urgentLabel}>
          <Ionicons name="alert-circle" size={12} color="#e53935" />
          <Text style={styles.urgentLabelText}>URGENT</Text>
        </View>
      )}

      {!task.urgent && !task.completed && (
        <Ionicons name="chevron-forward-outline" size={18} color="#c4cad3" />
      )}
    </TouchableOpacity>
  );
}

/** Footer tab button item */
function FooterItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.footerItem}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={[styles.footerIconContainer, active && styles.footerIconActive]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? "#08192d" : "#8a93a1"}
        />
      </View>
      <Text style={[styles.footerLabel, active && styles.footerLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
