/**
 * Component: RootLayout
 * Description: Root navigation layout component using Expo Router's Stack navigator.
 * Configures the primary stack screens and their respective header navigation options.
 */

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Home Screen: Displays task list */}
      <Stack.Screen
        name="index"
        options={{
          title: "My Tasks",
        }}
      />

      {/* Add Task Screen: Form to create new tasks */}
      <Stack.Screen
        name="add-task"
        options={{
          title: "Add a Task",
        }}
      />

      {/* Time Tracking Screen: Stopwatch and time recording */}
      <Stack.Screen
        name="time"
        options={{
          title: "Time Tracking",
        }}
      />
    </Stack>
  );
}
