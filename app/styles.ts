/**
 * Stylesheet File: Dashboard / Task List
 * Description: Centralized React Native stylesheet for the main screen.
 * Organized by blocks of visual elements (Header, Menu, Stats, Cards, Footer).
 */

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ==========================================
  // 1. MAIN CONTAINER
  // ==========================================

  /** Global background area of the screen */
  container: {
    flex: 1,
    backgroundColor: "#f6f8fb", // Very light gray to contrast with white cards
  },

  // ==========================================
  // 2. HEADER / TOP BAR
  // ==========================================

  /** Fixed header bar at the top of the screen */
  topBar: {
    height: 72,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f4",
  },

  /** Generic button in the header (e.g., filter or back button) */
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  /** Active state of the filter button (pale red background) */
  filterActiveButton: {
    backgroundColor: "#fff0ef",
  },

  /** Centered container for the app title and subtitle */
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },

  /** Main title in the header */
  appTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#08192d",
    letterSpacing: 0.3,
  },

  /** Subtitle in the header */
  appSubtitle: {
    fontSize: 9,
    color: "#929aa7",
    marginTop: 2,
    letterSpacing: 0.4,
  },

  /** Reserved area for actions located on the right of the header */
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ==========================================
  // 3. DROPDOWN MENU / FILTER OPTIONS
  // ==========================================

  /** Container of the dropdown menu with drop shadow */
  menu: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9edf2",
    elevation: 5, // Shadow on Android
    shadowColor: "#000", // Shadow on iOS
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  /** Individual row in the menu */
  menuItem: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
  },

  /** Container for the icon within a menu item */
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#f1f4f8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  /** Red icon variant (e.g., for urgent filters) */
  redIcon: {
    backgroundColor: "#fff0ef",
  },

  /** Text area inside a menu option */
  menuTextContainer: {
    flex: 1,
  },

  /** Main label of the menu item */
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#172033",
  },

  /** Sub-text indicating an active filter within the menu */
  activeFilterText: {
    fontSize: 10,
    color: "#e53935",
    fontWeight: "700",
    marginTop: 2,
  },

  // ==========================================
  // 4. MAIN CONTENT AREA & FILTERS
  // ==========================================

  /** Scrollable content area (ScrollView / FlatList) */
  content: {
    flex: 1,
  },

  /** Internal padding of the scrollable content */
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 20,
  },

  /** Welcome section (Greeting message + icon of the day) */
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  /** Greeting text (e.g., "Bonjour,") */
  greeting: {
    fontSize: 13,
    color: "#8993a2",
    fontWeight: "500",
    marginBottom: 3,
  },

  /** Grand welcome title */
  heading: {
    fontSize: 29,
    fontWeight: "800",
    color: "#08192d",
  },

  /** Summary text under the main title */
  summary: {
    fontSize: 13,
    color: "#8b94a2",
    marginTop: 5,
  },

  /** Yellow badge illustrating the current day or quick access */
  todayIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#f6c945",
    alignItems: "center",
    justifyContent: "center",
  },

  /** Alert banner informing of an active filter */
  activeFilterBanner: {
    minHeight: 48,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#edf0f4",
  },

  /** Left side of the filter banner */
  activeFilterLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  /** Text of the currently applied filter */
  activeFilterBannerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#08192d",
    marginLeft: 8,
  },

  /** Button to clear the active filter */
  clearFilterText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#e53935",
  },

  // ==========================================
  // 5. STATISTICAL CARDS (SUMMARY)
  // ==========================================

  /** Container aligning the 3 statistic cards side-by-side */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 27,
  },

  /** Individual statistic card */
  statCard: {
    width: "31.5%", // Allows fitting 3 cards evenly with spacing
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  /** Small icon at the top of the statistic card */
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#f1f4f8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  /** Grand number representing the statistical data */
  statNumber: {
    fontSize: 21,
    fontWeight: "800",
    color: "#08192d",
  },

  /** Descriptive label beneath the number */
  statLabel: {
    fontSize: 11,
    color: "#8993a2",
    marginTop: 3,
  },

  // ==========================================
  // 6. TASK SECTION HEADERS
  // ==========================================

  /** Container for a list section (e.g., "Today", "Urgent") */
  section: {
    marginBottom: 22,
  },

  /** Title bar of the section with a counter */
  sectionHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  /** Group containing the title and optional dot */
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  /** Standard section title */
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#08192d",
    letterSpacing: 1,
  },

  /** Urgent section title (Red) */
  urgentTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#e53935",
    letterSpacing: 1,
  },

  /** Flashing or red dot to signal urgency */
  urgentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e53935",
    marginRight: 8,
  },

  /** Badge indicating the number of tasks in the section */
  countBadge: {
    minWidth: 25,
    height: 25,
    borderRadius: 13,
    paddingHorizontal: 7,
    backgroundColor: "#e9edf3",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
  },

  /** Text of the number inside the standard badge */
  countText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#08192d",
  },

  /** Counting badge for the urgent section */
  urgentBadge: {
    minWidth: 25,
    height: 25,
    borderRadius: 13,
    paddingHorizontal: 7,
    backgroundColor: "#fff0ef",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
  },

  /** Text of the number inside the urgent badge */
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#e53935",
  },

  // ==========================================
  // 7. INDIVIDUAL TASK CARD
  // ==========================================

  /** Main container for a task item */
  taskCard: {
    minHeight: 76,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.035,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  /** Visual variant for urgent tasks (Red left border) */
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e53935",
  },

  /** Reduced opacity for completed tasks */
  completedCard: {
    opacity: 0.82,
  },

  /** Custom checkbox (Unchecked state) */
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#d0d6df",
    alignItems: "center",
    justifyContent: "center",
  },

  /** Style for the checkbox when checked (Completed state) */
  checkboxCompleted: {
    backgroundColor: "#08192d",
    borderColor: "#08192d",
  },

  /** Style for the checkbox if the task is urgent */
  checkboxUrgent: {
    borderColor: "#e53935",
  },

  /** Central text area containing the title and date */
  taskInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  /** Title of the task */
  taskTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#172033",
  },

  /** Style applied to the title when the task is crossed out/completed */
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#9da5b1",
  },

  /** Row containing the calendar icon and date */
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  /** Display of the due date */
  taskDate: {
    fontSize: 11,
    color: "#8b94a2",
    marginLeft: 5,
  },

  /** "Urgent" label attached to the card */
  urgentLabel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0ef",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  /** Text inside the "Urgent" badge */
  urgentLabelText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#e53935",
    marginLeft: 3,
  },

  // ==========================================
  // 8. EMPTY STATE
  // ==========================================

  /** Block displayed when there are no tasks in the list */
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  /** Circle background for the empty state icon */
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#fff3c9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  /** Main title of the empty state */
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#08192d",
  },

  /** Textual explanation of the empty state */
  emptyText: {
    fontSize: 12,
    color: "#8993a2",
    textAlign: "center",
    marginTop: 7,
    lineHeight: 18,
  },

  /** Action button in the empty state (e.g., "Create a Task") */
  emptyButton: {
    backgroundColor: "#f6c945",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 18,
  },

  /** Text inside the empty state button */
  emptyButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#08192d",
  },

  // ==========================================
  // 9. FLOATING ACTION BUTTON (FAB) & NAVIGATION
  // ==========================================

  /** Floating action button (+ / FAB) */
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 116, // Offset upwards to prevent overlap with the footer
    zIndex: 999, // Ensures the button stays above the list content

    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: "#f6c945",

    alignItems: "center",
    justifyContent: "center",

    elevation: 12, // Strong shadow on Android

    shadowColor: "#000", // Drop shadow on iOS
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  /** Bottom navigation bar (Tab Bar / Footer) */
  footer: {
    height: 72,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e9edf2",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    paddingHorizontal: 8,
  },

  /** Individual tab within the footer (occupying 25% of the width) */
  footerItem: {
    width: "25%",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  /** Container framing the tab icon */
  footerIconContainer: {
    width: 39,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  /** Highlight for the active tab icon container */
  footerIconActive: {
    backgroundColor: "#fff3c9",
  },

  /** Text label beneath the tab icon */
  footerLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8993a2",
    marginTop: 3,
  },

  /** Text label for the active tab */
  footerLabelActive: {
    color: "#08192d",
    fontWeight: "800",
  },

  /** Invisible spacer at the bottom of the list to prevent obscuring cards */
  bottomSpace: {
    height: 20,
  },
});

export default styles;
