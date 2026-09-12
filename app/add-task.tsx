/**
 * Component: AddTask
 * Description: Screen for creating a new task in the application.
 * Contains a complete form with title, description, date/time selection
 * and image addition (via camera or gallery).
 */

// --- IMPORTS ---

// Native date and time picker component
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

// Expo API for camera and photo gallery access
import * as ImagePicker from "expo-image-picker";

// Expo Router navigation utility for screen changes
import { router } from "expo-router";

// React Hooks for state management
import { useState } from "react";

// Core React Native components
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

// Component to prevent overlapping with notches and the home bar
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTask() {
  // ==========================================
  // FORM STATES (STATE MANAGEMENT)
  // ==========================================

  /** Task Title (Required field) */
  const [title, setTitle] = useState("");

  /** Detailed description of the task (Optional) */
  const [description, setDescription] = useState("");

  /** Local URI of the selected or captured image */
  const [imageUri, setImageUri] = useState<string | null>(null);

  /** Chosen due date */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  /** Chosen due time */
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  // ==========================================
  // USER INTERFACE STATES (UI STATES)
  // ==========================================

  /** Indicates if a validation error is displayed on the title */
  const [titleError, setTitleError] = useState(false);

  /** Controls visibility of the native date Picker */
  const [showDatePicker, setShowDatePicker] = useState(false);

  /** Controls visibility of the native time Picker */
  const [showTimePicker, setShowTimePicker] = useState(false);

  /** Controls visibility of the media modal menu (Camera / Gallery choice) */
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);

  /** Controls visibility of the fullscreen image preview modal */
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  // ==========================================
  // DATE AND TIME HANDLERS
  // ==========================================

  /**
   * Updates the selected date.
   * On Android, automatically hides the picker after validation.
   */
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep picker on iOS, close on Android
    if (date) setSelectedDate(date);
  };

  /**
   * Updates the selected time.
   * On Android, automatically hides the picker after validation.
   */
  const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (time) setSelectedTime(time);
  };

  /** Formats a Date object into a readable date string (e.g., "en-US" locale) */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /** Formats time into readable format (e.g., "en-US" locale, "14:30") */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // MEDIA / IMAGE PICKER HANDLERS
  // ==========================================

  /**
   * Requests permission and launches the device camera.
   */
  const handleTakePhoto = async () => {
    setIsMediaModalVisible(false);

    // Request camera access permission
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission denied",
        "Camera access is required to take a photo.",
      );
      return;
    }

    // Capture image
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Allow cropping
      aspect: [4, 3],
      quality: 0.8, // Slight compression
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  /**
   * Requests permission and opens the device photo gallery.
   */
  const handlePickGallery = async () => {
    setIsMediaModalVisible(false);

    // Request gallery access permission
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission denied",
        "Gallery access is required to select a photo.",
      );
      return;
    }

    // Select image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ==========================================
  // TASK SAVE HANDLER
  // ==========================================

  /**
   * Validates required fields, assembles task object, and saves.
   */
  const handleAddTask = () => {
    // Validate title field
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    // Merge selected date and time into a single Date object
    const finalDueDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
    );

    // Build task object
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      imageUri,
      dueDate: finalDueDate.toISOString(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    console.log("New task created:", newTask);

    // Return to previous screen after creation
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* ================= HEADER ================= */}
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

        {/* ================= SCROLLABLE FORM ================= */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Field: Title */}
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
                if (titleError && text.trim()) setTitleError(false);
              }}
            />
            {titleError && (
              <Text style={styles.errorText}>Title is required.</Text>
            )}
          </View>

          {/* Field: Description */}
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

          {/* Field: Attachment / Photo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attachment / Photo</Text>

            {imageUri ? (
              // Display card if an image is selected
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
              // Drop / click zone if no image is chosen
              <TouchableOpacity
                style={styles.uploadPlaceholder}
                activeOpacity={0.7}
                onPress={() => setIsMediaModalVisible(true)}
              >
                <View style={styles.uploadIconBadge}>
                  <Text style={{ fontSize: 22 }}>📸</Text>
                </View>
                <Text style={styles.uploadTitle}>Add an Image</Text>
                <Text style={styles.uploadSubtext}>
                  Take a photo or choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date and Time Pickers */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date and Time</Text>
            <View style={styles.dateTimeRow}>
              {/* Date Selection Card */}
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

              {/* Time Selection Card */}
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

            {/* Native components triggered on click */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Form Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleAddTask}
            >
              <Text style={styles.primaryButtonText}>Create Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.6}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ================= MODAL: IMAGE SOURCE SELECTION ================= */}
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

        {/* ================= MODAL: FULLSCREEN IMAGE PREVIEW ================= */}
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

        {/* ================= NAVIGATION FOOTER ================= */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push("/")}
            activeOpacity={0.7}
          >
            <View style={styles.footerIconContainer}>
              <Text style={{ fontSize: 18 }}>📋</Text>
            </View>
            <Text style={styles.footerLabel}>Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push("/add-task")}
            activeOpacity={0.7}
          >
            <View style={[styles.footerIconContainer, styles.footerIconActive]}>
              <Text style={{ fontSize: 18 }}>➕</Text>
            </View>
            <Text style={[styles.footerLabel, styles.footerLabelActive]}>
              Add
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
            <View style={styles.footerIconContainer}>
              <Text style={{ fontSize: 18 }}>📊</Text>
            </View>
            <Text style={styles.footerLabel}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
            <View style={styles.footerIconContainer}>
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </View>
            <Text style={styles.footerLabel}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  /* Header */
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

  /* Form Content */
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

  /* Image Cards and Upload */
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

  /* Date and Time Components */
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

  /* Action Buttons */
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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

  /* Modals */
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

  /* Fullscreen Preview */
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

  /* Footer (Navigation Bar) */
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
