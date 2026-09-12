task-management/
├── README.md
├── package.json
├── app.json
└── src/
└── app/
├── index.tsx
├── add-task.tsx
├── time.tsx
├── \_layout.tsx
└── styles.ts

# Task Management

## Overview

Task Management is a mobile application designed to help users organize, manage, and track their daily tasks in a simple and efficient way.

The application allows users to view their tasks, identify urgent tasks, track completed tasks, and add new tasks. It also includes a time-tracking feature that allows users to record the amount of time spent working on a task.

The goal of creating this application is to deepen my knowledge of mobile application development using React Native and to apply important programming concepts such as state management, navigation, reusable components, and mobile user interface design.

### How to Use the Application

Users can:

- View their list of tasks.
- Quickly identify urgent tasks.
- See the number of completed tasks.
- Mark tasks as completed.
- Add a new task with a title and description.
- Filter tasks according to their status.
- Open the time-tracking screen.
- Navigate between the different features of the application.

The application uses a simple and user-friendly interface designed for mobile devices.

### Demonstration

A 4–5 minute demonstration video will show the application running and explain important parts of the source code.

[Software Demonstration Video]https://youtu.be/F6f6MfUI8AQ?si=nsg5EUvrSUj0luK9

https://github.com/formationWeb-Lus/task-management.git

> Replace the link above with the actual YouTube link before publishing the project on GitHub.

## Development Environment

The application was developed using the following tools and technologies:

- **Visual Studio Code** — code editor used to develop the application.
- **React Native** — framework used to build the mobile application.
- **Expo** — platform used to develop, test, and run the React Native application.
- **Expo Router** — navigation system used to move between application screens.
- **TypeScript / JavaScript** — programming languages used to develop the application.
- **Git** — version control system used to track changes to the project.
- **GitHub** — platform used to store and manage the source code.
- **Expo Go** — application used to test the project on a mobile device.

### Main Libraries

The project uses the following libraries:

- `expo-router` — used to manage navigation between screens.
- `@expo/vector-icons` — used to display icons in the user interface.
- `react-native` — used to create the application's components and user interface.
- `react-native-safe-area-context` — used to properly display the interface within the safe areas of mobile devices.

### Application Structure

The application is organized into several screens and files to keep the code clear and maintainable.

- `index.tsx` — main screen that displays the task list and task statistics.
- `add-task.tsx` — screen used to create a new task.
- `time.tsx` — screen used to track the time spent on a task.
- `_layout.tsx` — configuration for the application's navigation.
- `styles.ts` — contains the styles used throughout the user interface.

This structure helps keep the application organized and makes the code easier to maintain and improve.

## Useful Websites

The following websites were useful during the development of this project:

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [GitHub Documentation](https://docs.github.com/)

## Future Work

The following improvements could be added in future versions of the application:

- Add permanent local storage so tasks remain available after closing the application.
- Allow users to edit existing tasks.
- Allow users to delete tasks.
- Add a task search feature.
- Improve the task filtering system.
- Add notifications and reminders for important tasks.
- Add due dates and times to tasks.
- Allow users to attach an image or photo to a task.
- Integrate additional native phone features such as the camera or sensors.
- Improve the user interface and overall user experience.
- Add cloud synchronization using a database or cloud service.
- Add authentication so each user can have their own tasks.
- Improve the time-tracking system.
- Add statistics to help users analyze their productivity.
