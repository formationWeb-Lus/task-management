/**
 * Component: AddTask
 * Description:
 * Screen used to create and save a new task.
 *
 * The screen allows the user to:
 * - Enter a task title and description.
 * - Select a due date and time.
 * - Add a photo from the camera or gallery.
 * - Save the task permanently using AsyncStorage.
 *
 * The same AsyncStorage key is used by the home screen
 * so both screens can access the same task data.
 */

// ==========================================
// IMPORTS
// ==========================================

// Native date and time picker
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

// Expo image picker for camera and gallery
import * as ImagePicker from "expo-image-picker";

// AsyncStorage allows tasks to remain saved on the device
import AsyncStorage from "@react-native-async-storage/async-storage";

// Expo Router navigation
import { router } from "expo-router";

// React state management
import { useState } from "react";

// React Native components
import {
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// SafeAreaView prevents content from overlapping system areas
import { SafeAreaView } from "react-native-safe-area-context";

// ==========================================
// STORAGE CONFIGURATION
// ==========================================

/**
 * Storage key shared with index.tsx.
 *
 * Important:
 * The same key must be used everywhere in the application
 * so all screens access the same list of tasks.
 */
export const TASKS_STORAGE_KEY = "@task_management_tasks";

// ==========================================
// COMPONENT
// ==========================================

export default function AddTask() {
  // ==========================================
  // FORM STATES
  // ==========================================

  /** Task title */
  const [title, setTitle] = useState("");

  /** Optional task description */
  const [description, setDescription] = useState("");

  /** URI of the selected or captured image */
  const [imageUri, setImageUri] = useState<string | null>(null);

  /** Selected due date */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  /** Selected due time */
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  // ==========================================
  // UI STATES
  // ==========================================

  /** Displays an error when the title is empty */
  const [titleError, setTitleError] = useState(false);

  /** Controls the date picker */
  const [showDatePicker, setShowDatePicker] = useState(false);

  /** Controls the time picker */
  const [showTimePicker, setShowTimePicker] = useState(false);

  /** Controls the camera/gallery modal */
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);

  /** Controls the fullscreen image preview */
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  /** Prevents multiple save operations */
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // DATE HANDLERS
  // ==========================================

  /**
   * Handles changes made in the date picker.
   *
   * Android closes the picker after selecting a date.
   * iOS keeps the picker visible.
   */
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (date) {
      setSelectedDate(date);
    }
  };

  /**
   * Handles changes made in the time picker.
   */
  const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    setShowTimePicker(Platform.OS === "ios");

    if (time) {
      setSelectedTime(time);
    }
  };

  // ==========================================
  // DATE / TIME FORMATTING
  // ==========================================

  /**
   * Converts a Date object into a readable date.
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * Converts a Date object into a readable time.
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // CAMERA
  // ==========================================

  /**
   * Requests camera permission and opens the device camera.
   */
  const handleTakePhoto = async () => {
    setIsMediaModalVisible(false);

    try {
      // Request permission to access the camera
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();

      if (!granted) {
        Alert.alert(
          "Permission denied",
          "Camera access is required to take a photo.",
        );
        return;
      }

      // Open the camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      // Save the selected image URI
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);

      Alert.alert("Camera error", "Unable to open the camera.");
    }
  };

  // ==========================================
  // GALLERY
  // ==========================================

  /**
   * Requests gallery permission and opens the photo library.
   */
  const handlePickGallery = async () => {
    setIsMediaModalVisible(false);

    try {
      // Request permission to access the photo library
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        Alert.alert(
          "Permission denied",
          "Gallery access is required to select a photo.",
        );
        return;
      }

      // Open the image gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      // Save the selected image URI
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);

      Alert.alert("Gallery error", "Unable to open the photo gallery.");
    }
  };

  // ==========================================
  // SAVE TASK
  // ==========================================

  /**
   * Saves the task to AsyncStorage.
   *
   * AsyncStorage stores the task as JSON on the device.
   * The existing tasks are loaded first so that creating
   * a new task does not delete previously saved tasks.
   */
  const handleAddTask = async () => {
    // Prevent multiple save operations
    if (isSaving) {
      return;
    }

    // Validate the required title
    if (!title.trim()) {
      setTitleError(true);

      Alert.alert("Missing title", "Please enter a title for your task.");

      return;
    }

    try {
      setIsSaving(true);

      // Combine the selected date and selected time
      const finalDueDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0,
      );

      /**
       * Create the new task.
       *
       * The fields completed and urgent are included because
       * the home screen uses them to display task status.
       *
       * Additional information such as description, imageUri,
       * dueDate and createdAt is also preserved.
       */
      const newTask = {
        id: Date.now().toString(),

        title: title.trim(),

        description: description.trim(),

        date: finalDueDate.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),

        dueDate: finalDueDate.toISOString(),

        createdAt: new Date().toISOString(),

        imageUri: imageUri,

        completed: false,

        urgent: false,

        status: "pending",
      };

      // ------------------------------------------
      // LOAD EXISTING TASKS
      // ------------------------------------------

      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

      /**
       * If tasks already exist, convert the JSON string
       * back into a JavaScript array.
       *
       * Otherwise start with an empty array.
       */
      const existingTasks = storedTasks ? JSON.parse(storedTasks) : [];

      // Make sure the stored data is actually an array
      const tasks = Array.isArray(existingTasks) ? existingTasks : [];

      // ------------------------------------------
      // ADD NEW TASK
      // ------------------------------------------

      tasks.push(newTask);

      // ------------------------------------------
      // SAVE TASKS TO THE PHONE
      // ------------------------------------------

      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

      console.log("Task saved successfully:", newTask);

      // Show confirmation to the user
      Alert.alert("Task created", "Your task has been saved successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving task:", error);

      Alert.alert(
        "Save error",
        "The task could not be saved. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.headerBackIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>New Task</Text>

            <Text style={styles.headerSubtitle}>Fill in details below</Text>
          </View>
        </View>

        {/* ======================================
            FORM
        ====================================== */}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Task title */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Task Title <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              style={[styles.input, titleError && styles.inputError]}
              placeholder="E.g.: React Native Project Review"
              placeholderTextColor="#a0aec0"
              value={title}
              onChangeText={(text) => {
                setTitle(text);

                if (titleError && text.trim()) {
                  setTitleError(false);
                }
              }}
            />

            {titleError && (
              <Text style={styles.errorText}>Title is required.</Text>
            )}
          </View>

          {/* Task description */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add extra notes or details..."
              placeholderTextColor="#a0aec0"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Image attachment */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attachment / Photo</Text>

            {imageUri ? (
              <View style={styles.imageCard}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setIsPreviewModalVisible(true)}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.imagePreview}
                  />
                </TouchableOpacity>

                <View style={styles.imageOverlayControls}>
                  <TouchableOpacity
                    style={styles.imageActionBtn}
                    onPress={() => setIsMediaModalVisible(true)}
                  >
                    <Text style={styles.imageActionText}>🔄 Change</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.imageActionBtn, styles.imageDeleteBtn]}
                    onPress={() => setImageUri(null)}
                  >
                    <Text style={styles.imageDeleteText}>🗑️ Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadPlaceholder}
                activeOpacity={0.7}
                onPress={() => setIsMediaModalVisible(true)}
              >
                <View style={styles.uploadIconBadge}>
                  <Text style={styles.cameraEmoji}>📸</Text>
                </View>

                <Text style={styles.uploadTitle}>Add an Image</Text>

                <Text style={styles.uploadSubtext}>
                  Take a photo or choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date and time */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date and Time</Text>

            <View style={styles.dateTimeRow}>
              {/* Date */}

              <TouchableOpacity
                style={styles.pickerCard}
                activeOpacity={0.7}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.pickerIcon}>📅</Text>

                <View>
                  <Text style={styles.pickerLabel}>Date</Text>

                  <Text style={styles.pickerValue}>
                    {formatDate(selectedDate)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Time */}

              <TouchableOpacity
                style={styles.pickerCard}
                activeOpacity={0.7}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.pickerIcon}>⏰</Text>

                <View>
                  <Text style={styles.pickerLabel}>Time</Text>

                  <Text style={styles.pickerValue}>
                    {formatTime(selectedTime)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Native date picker */}

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Native time picker */}

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* ======================================
              ACTION BUTTONS
          ====================================== */}

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, isSaving && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleAddTask}
              disabled={isSaving}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? "Saving..." : "Create Task"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.6}
              onPress={() => router.back()}
              disabled={isSaving}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ======================================
            IMAGE SOURCE MODAL
        ====================================== */}

        <Modal
          visible={isMediaModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMediaModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsMediaModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add a Photo</Text>

              <Text style={styles.modalSubtitle}>Choose an image source</Text>

              <TouchableOpacity
                style={styles.modalOption}
                activeOpacity={0.7}
                onPress={handleTakePhoto}
              >
                <Text style={styles.modalOptionIcon}>📷</Text>

                <Text style={styles.modalOptionText}>Take a Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                activeOpacity={0.7}
                onPress={handlePickGallery}
              >
                <Text style={styles.modalOptionIcon}>🖼️</Text>

                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsMediaModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ======================================
            FULLSCREEN IMAGE PREVIEW
        ====================================== */}

        <Modal
          visible={isPreviewModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsPreviewModalVisible(false)}
        >
          <View style={styles.fullScreenModal}>
            <TouchableOpacity
              style={styles.closePreviewButton}
              onPress={() => setIsPreviewModalVisible(false)}
            >
              <Text style={styles.closePreviewText}>✕</Text>
            </TouchableOpacity>

            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

        {/* ======================================
            FOOTER
        ====================================== */}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push("/")}
            activeOpacity={0.7}
          >
            <View style={styles.footerIconContainer}>
              <Text style={styles.footerIcon}>📋</Text>
            </View>

            <Text style={styles.footerLabel}>Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push("/add-task")}
            activeOpacity={0.7}
          >
            <View style={[styles.footerIconContainer, styles.footerIconActive]}>
              <Text style={styles.footerIcon}>➕</Text>
            </View>

            <Text style={[styles.footerLabel, styles.footerLabelActive]}>
              Add
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
            <View style={styles.footerIconContainer}>
              <Text style={styles.footerIcon}>📊</Text>
            </View>

            <Text style={styles.footerLabel}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
            <View style={styles.footerIconContainer}>
              <Text style={styles.footerIcon}>⚙️</Text>
            </View>

            <Text style={styles.footerLabel}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  // Main containers
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerBackIcon: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },

  // Form
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  required: {
    color: "#ef4444",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },

  textArea: {
    height: 110,
    textAlignVertical: "top",
  },

  // Image upload
  uploadPlaceholder: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  cameraEmoji: {
    fontSize: 22,
  },

  uploadTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },

  uploadSubtext: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },

  imageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  imagePreview: {
    width: "100%",
    height: 190,
  },

  imageOverlayControls: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#ffffff",
    gap: 10,
  },

  imageActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },

  imageActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },

  imageDeleteBtn: {
    backgroundColor: "#fef2f2",
  },

  imageDeleteText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ef4444",
  },

  // Date and time
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
  },

  pickerCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },

  pickerIcon: {
    fontSize: 20,
  },

  pickerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
  },

  pickerValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
  },

  // Buttons
  actionContainer: {
    marginTop: 10,
    gap: 12,
  },

  primaryButton: {
    backgroundColor: "#f6c945",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#f6c945",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#08192d",
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },

  // Media modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },

  modalSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    gap: 14,
  },

  modalOptionIcon: {
    fontSize: 20,
  },

  modalOptionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },

  modalCloseButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },

  modalCloseText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748b",
  },

  // Fullscreen image preview
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenImage: {
    width: "100%",
    height: "80%",
  },

  closePreviewButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closePreviewText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Bottom navigation
  footer: {
    height: 72,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingHorizontal: 8,
  },

  footerItem: {
    width: "25%",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  footerIconContainer: {
    width: 39,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  footerIconActive: {
    backgroundColor: "#fff3c9",
  },

  footerIcon: {
    fontSize: 18,
  },

  footerLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8993a2",
    marginTop: 3,
  },

  footerLabelActive: {
    color: "#08192d",
    fontWeight: "800",
  },
});
