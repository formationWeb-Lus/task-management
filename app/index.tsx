// Import vector icons provided by Expo
import { Ionicons } from "@expo/vector-icons";
// Import router for navigation between screens using expo-router
import { router } from "expo-router";
// Import React state hook
import { useState } from "react";
// Import core React Native components
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import safe area context provider to handle notches and system bars
import { SafeAreaView } from "react-native-safe-area-context";

// Import custom styles from external stylesheet
import styles from "./styles";

/**
 * Definition for available filter types in English
 */
type FilterType = "All" | "Urgent" | "Completed";

/**
 * Data structure definition for a task
 */
type Task = {
  id: string; // Unique identifier
  title: string; // Task title or label
  date: string; // Due date or time display text
  completed: boolean; // Completion status
  urgent: boolean; // Priority indicator
};

/**
 * Initial sample task list in English for rendering
 */
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

/**
 * Main screen component (Index)
 */
export default function Index() {
  // --- STATES ---

  // Main tasks array stored in local state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Controls top-left dropdown menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  // Controls collapse/expand state for urgent tasks section
  const [urgentOpen, setUrgentOpen] = useState(true);

  // Controls collapse/expand state for standard tasks section
  const [tasksOpen, setTasksOpen] = useState(true);

  // Currently selected task filter ("All", "Urgent", or "Completed")
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  // --- FUNCTIONS & EVENT HANDLERS ---

  /**
   * Toggles the `completed` state of a specific task
   * @param id Target task ID to update
   */
  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  /**
   * Opens native system share sheet to share current task count
   */
  const shareTasks = async () => {
    try {
      await Share.share({
        message: `I have ${tasks.length} tasks in my Task app.`,
      });
    } catch (error) {
      console.log("Error sharing tasks:", error);
    }
  };

  /**
   * Filters the task array based on `activeFilter` state
   */
  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "Urgent":
        // Filter urgent AND non-completed tasks
        return tasks.filter((task) => task.urgent && !task.completed);
      case "Completed":
        // Filter completed tasks
        return tasks.filter((task) => task.completed);
      case "All":
      default:
        return tasks;
    }
  };

  // --- DERIVED STATE VALUES ---

  // Master filtered task array based on selection
  const filteredTasks = getFilteredTasks();

  // Subset of tasks allocated to "URGENT" section
  const urgentTasks = filteredTasks.filter(
    (task) => task.urgent && !task.completed,
  );

  // Subset of non-urgent or completed tasks allocated to general section
  const normalTasks = filteredTasks.filter(
    (task) => !task.urgent || task.completed,
  );

  // Total count of completed tasks for stats section
  const completedCount = tasks.filter((task) => task.completed).length;

  // Total count of pending tasks for stats section
  const pendingCount = tasks.filter((task) => !task.completed).length;

  /**
   * Updates active filter and automatically opens target sections
   * @param filter New filter selected
   */
  const changeFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    setMenuOpen(false); // Close dropdown menu if open

    // Auto-expand appropriate sections according to active filter
    if (filter === "Urgent") setUrgentOpen(true);
    if (filter === "All") {
      setUrgentOpen(true);
      setTasksOpen(true);
    }
    if (filter === "Completed") setTasksOpen(true);
  };

  /**
   * Triggers native alert dialog for quick filter selection
   */
  const showFilter = () => {
    Alert.alert("Filter Tasks", "Choose a filter to apply", [
      { text: "All", onPress: () => changeFilter("All") },
      { text: "Urgent", onPress: () => changeFilter("Urgent") },
      { text: "Completed", onPress: () => changeFilter("Completed") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // --- COMPONENT RENDER ---
  return (
    // SafeAreaView handles device notches and home indicator paddings
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* --- TOP HEADER BAR --- */}
      <View style={styles.topBar}>
        {/* Hamburger menu trigger */}
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

        {/* App title and dynamic active filter subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Task</Text>
          <Text style={styles.appSubtitle}>
            {activeFilter === "All"
              ? "Task Manager"
              : `Filter: ${activeFilter}`}
          </Text>
        </View>

        {/* Action icons (Filter dialog & Share) */}
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

      {/* --- DROPDOWN MENU (CONDITIONALLY RENDERED) --- */}
      {menuOpen && (
        <View style={styles.menu}>
          {/* Option: All tasks */}
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

          {/* Option: Urgent tasks */}
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

          {/* Option: Navigate to time tracking screen */}
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

          {/* Option: Completed tasks */}
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

      {/* --- SCROLLABLE MAIN CONTENT AREA --- */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting banner section */}
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

        {/* Statistical overview cards (Total, To Do, Completed) */}
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

        {/* Active filter badge banner with clear trigger */}
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

        {/* --- URGENT TASKS ACCORDION SECTION --- */}
        {urgentTasks.length > 0 && (
          <View style={styles.section}>
            {/* Section toggle header */}
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

            {/* List of urgent task cards */}
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

        {/* --- REGULAR / COMPLETED TASKS ACCORDION SECTION --- */}
        {normalTasks.length > 0 && (
          <View style={styles.section}>
            {/* Section toggle header */}
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

            {/* List of standard task cards */}
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

        {/* --- EMPTY STATE VIEW --- */}
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

        {/* Bottom padding spacer preventing content overlap with bottom tab bar */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* --- FLOATING ACTION BUTTON (FAB) --- */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.85}
        onPress={() => router.push("/add-task")}
      >
        <Ionicons name="add" size={31} color="#08192d" />
      </TouchableOpacity>

      {/* --- BOTTOM NAVIGATION BAR (FOOTER) --- */}
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

/**
 * Reusable component representing an individual task card
 * @param task Task object data to display
 * @param onPress Press handler toggling task completion status
 */
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
      {/* Task checkbox toggle */}
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

      {/* Task information details (Title & Date) */}
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

      {/* Urgent indicator badge displayed for active urgent tasks */}
      {task.urgent && !task.completed && (
        <View style={styles.urgentLabel}>
          <Ionicons name="alert-circle" size={12} color="#e53935" />
          <Text style={styles.urgentLabelText}>URGENT</Text>
        </View>
      )}

      {/* Forward chevron indicator for standard pending tasks */}
      {!task.urgent && !task.completed && (
        <Ionicons name="chevron-forward-outline" size={18} color="#c4cad3" />
      )}
    </TouchableOpacity>
  );
}

/**
 * Reusable component for bottom tab navigation bar items
 * @param icon Ionicons glyph identifier
 * @param label Text label for the item
 * @param active Boolean indicating if current tab is active
 * @param onPress Action trigger on tab press
 */
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
          color={active ? "#08192d" : "#8993a2"}
        />
      </View>

      <Text style={[styles.footerLabel, active && styles.footerLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
