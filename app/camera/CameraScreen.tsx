"use client";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { State } from "react-native-gesture-handler";
import FilterPreview from "./FilterPreview";
import IntensitySlider from "./IntensitySlider";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");


export default function CameraScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(1.0);
  const [isEditing, setIsEditing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 1, height: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  
  const cameraRef = useRef<CameraView | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const filters = [
    { name: "none", label: "Original", icon: "photo" },
    { name: "grayscale", label: "B&W", icon: "photo-filter" },
    { name: "sepia", label: "Sepia", icon: "photo-filter" },
    { name: "vintage", label: "Vintage", icon: "photo-filter" },
  ];

  // Request camera permission
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Load saved photo on mount
  useEffect(() => {
    loadSavedPhoto();
  }, []);

  const loadSavedPhoto = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem("capturedPhoto");
      if (savedPhoto) {
        setCapturedPhoto(savedPhoto);
      }
    } catch (error) {
      console.error("Error loading saved photo:", error);
    }
  };

  const savePhoto = async (uri: string) => {
    try {
      await AsyncStorage.setItem("capturedPhoto", uri);
      setCapturedPhoto(uri);

      // Also persist into profile cache (avatar)
      try {
        const raw = await AsyncStorage.getItem("profile");
        const parsed = raw ? JSON.parse(raw) : {};
        const updated = { ...parsed, avatar: uri };
        await AsyncStorage.setItem("profile", JSON.stringify(updated));
      } catch {}
    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert("Error", "Failed to save photo");
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 1,
          base64: false,
        });
        await savePhoto(photo.uri);
        setIsEditing(true);
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to take photo");
      }
    }
  };

  const toggleCamera = () => {
    setCameraType((prev: CameraType) =>
      prev === "back" ? "front" : "back"
    );
  };

  const applyFilter = async () => {
    if (!capturedPhoto) return;

    try {
      let manipulatedImage = { uri: capturedPhoto };
      
      // Apply rotation if needed
      if (rotation !== 0) {
        manipulatedImage = await ImageManipulator.manipulateAsync(
          capturedPhoto,
          [{ rotate: rotation }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
      }

      // Apply crop if needed
      if (cropData.width < 1 || cropData.height < 1) {
        const { width, height } = await getImageDimensions(manipulatedImage.uri);
        const cropWidth = width * cropData.width;
        const cropHeight = height * cropData.height;
        const cropX = width * cropData.x;
        const cropY = height * cropData.y;

        manipulatedImage = await ImageManipulator.manipulateAsync(
          manipulatedImage.uri,
          [{
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            }
          }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
      }

      await savePhoto(manipulatedImage.uri);

      // Trigger callback to parent if provided (e.g., Profile screen)
      const onCapture = route?.params?.onCapture as undefined | ((uri: string) => void);
      if (onCapture) {
        try { onCapture(manipulatedImage.uri); } catch {}
      }

      setIsEditing(false);
      setShowFilters(false);
      setShowIntensitySlider(false);
      setRotation(0);
      setCropData({ x: 0, y: 0, width: 1, height: 1 });

      // Prefer react-navigation goBack when available
      try {
        navigation.goBack();
      } catch {
        router.back();
      }
    } catch (error) {
      console.error("Error applying filter:", error);
      Alert.alert("Error", "Failed to apply filter");
    }
  };

  const getImageDimensions = (uri: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      Image.getSize(uri, (width, height) => {
        resolve({ width, height });
      }, reject);
    });
  };

  const rotatePhoto = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    
    Animated.timing(rotateAnim, {
      toValue: newRotation,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const resetPhoto = () => {
    setRotation(0);
    setCropData({ x: 0, y: 0, width: 1, height: 1 });
    setCurrentFilter("none");
    setFilterIntensity(1.0);
    rotateAnim.setValue(0);
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: scaleAnim, translationY: scaleAnim } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      // Update crop data based on gesture
      const newCropX = Math.max(0, Math.min(1, cropData.x + translationX / screenWidth));
      const newCropY = Math.max(0, Math.min(1, cropData.y + translationY / screenHeight));
      setCropData(prev => ({
        ...prev,
        x: newCropX,
        y: newCropY,
      }));
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.grantBtn}
        >
          <Text style={styles.grantBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isEditing && capturedPhoto) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.headerBtn}>
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Photo</Text>
          <TouchableOpacity onPress={applyFilter} style={styles.headerBtn}>
            <FontAwesome name="check" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainerEditing}>
          <FilterPreview
            uri={capturedPhoto}
            filter={currentFilter}
            intensity={filterIntensity}
            rotation={rotation}
            scale={scaleAnim}
            style={styles.imageWrapper}
          />
        </View>

        <View style={styles.editingControls}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.name}
                onPress={() => {
                  setCurrentFilter(filter.name);
                  setShowIntensitySlider(filter.name !== "none");
                }}
                style={[
                  styles.filterBtn,
                  currentFilter === filter.name && styles.activeFilterBtn,
                ]}
              >
                <MaterialIcons
                  name={filter.icon as any}
                  size={24}
                  color={currentFilter === filter.name ? "#007AFF" : "#fff"}
                />
                <Text
                  style={[
                    styles.filterLabel,
                    currentFilter === filter.name && styles.activeFilterLabel,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {showIntensitySlider && (
            <IntensitySlider
              value={filterIntensity}
              onValueChange={setFilterIntensity}
              label="Filter Intensity"
            />
          )}

          <View style={styles.toolBar}>
            <TouchableOpacity onPress={rotatePhoto} style={styles.toolBtn}>
              <FontAwesome name="rotate-right" size={24} color="#fff" />
              <Text style={styles.toolLabel}>Rotate</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetPhoto} style={styles.toolBtn}>
              <FontAwesome name="undo" size={24} color="#fff" />
              <Text style={styles.toolLabel}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraType} ref={cameraRef} />

      {capturedPhoto && (
        <View style={styles.photoPreview}>
          <Image source={{ uri: capturedPhoto }} style={styles.thumbnail} />
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.flipBtn} onPress={toggleCamera}>
          <FontAwesome name="refresh" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureBtn}
          onPress={takePhoto}
          onPressIn={() => {
            Animated.spring(scaleAnim, {
              toValue: 0.9,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
        >
          <Animated.View
            style={[
              styles.captureBtnInner,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
        </TouchableOpacity>

        {capturedPhoto && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditing(true)}
          >
            <FontAwesome name="edit" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  grantBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  grantBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  photoPreview: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  flipBtn: {
    position: "absolute",
    right: 30,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
  },
  editBtn: {
    position: "absolute",
    left: 30,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerBtn: {
    padding: 10,
    zIndex: 11,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  imageContainerEditing: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingTop: 64,
  },
  imageWrapper: {
    width: screenWidth - 40,
    height: screenHeight * 0.6,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  editingControls: {
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 20,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterBtn: {
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeFilterBtn: {
    backgroundColor: "rgba(0,122,255,0.3)",
  },
  filterLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  activeFilterLabel: {
    color: "#007AFF",
    fontWeight: "600",
  },
  toolBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  toolBtn: {
    alignItems: "center",
    marginHorizontal: 30,
    paddingVertical: 10,
  },
  toolLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
});
