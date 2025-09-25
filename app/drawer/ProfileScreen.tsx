import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];
const defaultAvatar = require("../../assets/images/default-avatar.png");

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  // Theme from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // Profile state
  const [profileUsername, setProfileUsername] = useState("jansen choi kai xuan");
  const [profileEmail, setProfileEmail] = useState("janchoi@gmail.com");
  const [profileGenre, setProfileGenre] = useState("Hip-Hop");
  const [avatar, setAvatar] = useState<any>(defaultAvatar);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; genre?: string }>({});
  const [success, setSuccess] = useState("");

  // Animations
  const fadeIn = useSharedValue(0);
  const shakeXUsername = useSharedValue(0);
  const shakeXEmail = useSharedValue(0);

  const bgColor = useSharedValue(mode === "light" ? "#fff" : "#121212");
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const inputBgColor = useSharedValue(mode === "light" ? "#f5f5f5" : "#1e1e1e");
  const headerTextColor = useSharedValue(mode === "light" ? "#000" : "#fff");

  useEffect(() => {
    if (mode === "light") {
      bgColor.value = withTiming("#fff", { duration: 400 });
      textColor.value = withTiming("#000", { duration: 400 });
      inputBgColor.value = withTiming("#f5f5f5", { duration: 400 });
      headerTextColor.value = withTiming("#000", { duration: 400 });
    } else {
      bgColor.value = withTiming("#121212", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      inputBgColor.value = withTiming("#1e1e1e", { duration: 400 });
      headerTextColor.value = withTiming("#fff", { duration: 400 });
    }
  }, [mode]);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 600 });
    loadCache();
  }, []);

  // Reload avatar whenever screen gains focus for persistence
  useFocusEffect(
    React.useCallback(() => {
      loadCache();
      return () => {};
    }, [])
  );

  const animatedProfileStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value }));
  const animatedContainerStyle = useAnimatedStyle(() => ({ backgroundColor: bgColor.value }));
  const animatedHeaderTextStyle = useAnimatedStyle(() => ({ color: headerTextColor.value }));
  const animatedTextStyle = useAnimatedStyle(() => ({ color: textColor.value }));

  const shakeStyleUsername = useAnimatedStyle(() => ({ transform: [{ translateX: shakeXUsername.value }] }));
  const shakeStyleEmail = useAnimatedStyle(() => ({ transform: [{ translateX: shakeXEmail.value }] }));

  const triggerShake = (field: "username" | "email") => {
    const target = field === "username" ? shakeXUsername : shakeXEmail;
    target.value = withSequence(
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const validate = useCallback((field: string, value: string) => {
    let error = "";
    if (field === "username") {
      if (!/^[a-zA-Z0-9_ ]{8,20}$/.test(value)) {
        error = "Username must be 8–20 characters (letters, numbers, underscores).";
      }
    }
    if (field === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email.";
      }
    }
    if (field === "genre") {
      if (!genres.includes(value)) {
        error = "Select a valid genre.";
      }
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Cache
  const saveCache = async (data: any) => {
    try {
      await AsyncStorage.setItem("profile", JSON.stringify(data));
    } catch (e) {
      console.log("Cache save error", e);
    }
  };

  const loadCache = async () => {
    try {
      const cache = await AsyncStorage.getItem("profile");
      if (cache) {
        const data = JSON.parse(cache);
        setProfileUsername(data.username || "Your Name");
        setProfileEmail(data.email || "your@email.com");
        setProfileGenre(data.genre || "Not selected");
        // Normalize avatar: if string URI, wrap in { uri }
        if (typeof data.avatar === "string" && data.avatar.length > 0) {
          setAvatar({ uri: data.avatar });
        } else if (data.avatar && typeof data.avatar === "object" && data.avatar.uri) {
          setAvatar({ uri: data.avatar.uri });
        } else {
          setAvatar(defaultAvatar);
        }
      }
    } catch (e) {
      console.log("Cache load error", e);
    }
  };

  const handleSubmit = async () => {
    validate("username", username);
    validate("email", email);
    validate("genre", genre);

    if (errors.username) triggerShake("username");
    if (errors.email) triggerShake("email");

    if (!errors.username && !errors.email && !errors.genre) {
      setProfileUsername(username);
      setProfileEmail(email);
      setProfileGenre(genre);

      const newData = { username, email, genre, avatar };
      await saveCache(newData);

      setSuccess("Profile updated successfully!");
      setUsername(""); setEmail(""); setGenre(""); setErrors({});
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Gallery picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      editImage(result.assets[0].uri);
    }
  };

  // Image editor (rotate + crop)
  const editImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ rotate: 0 }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setAvatar({ uri: result.uri });
    await saveCache({ username: profileUsername, email: profileEmail, genre: profileGenre, avatar: result.uri });
    // mirror into capturedPhoto for consistency
    try { await AsyncStorage.setItem("capturedPhoto", result.uri); } catch {}
  };

  // Choose source
  const chooseImageSource = () => {
    Alert.alert("Profile Photo", "Choose source", [
      { text: "Gallery", onPress: pickImage },
      {
        text: "Camera",
        onPress: () =>
          navigation.navigate("Playlists", {
            screen: "CameraScreen",
            params: { onCapture: (uri: string) => editImage(uri) },
          }),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };


  return (
    <Animated.ScrollView style={[styles.container, animatedContainerStyle]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <FontAwesome name="bars" size={28} color={accentColor} />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, animatedHeaderTextStyle]}>Profile</Animated.Text>
      </View>

      {/* Avatar + Info */}
      <Animated.View style={[animatedProfileStyle]}>
        <LinearGradient colors={mode === "light" ? ["#f0f0f0", "#e0e0e0"] : ["#2a2a2a", "#121212"]} style={styles.header}>
          <TouchableOpacity onPress={chooseImageSource}>
            <Image source={avatar} style={[styles.avatar, { borderColor: accentColor }]} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Animated.Text style={[styles.name, animatedTextStyle]}>{profileUsername}</Animated.Text>
            <Animated.Text style={[styles.email, animatedTextStyle]}>{profileEmail}</Animated.Text>
            <Animated.Text style={[styles.genre, animatedTextStyle]}>Favorite genre: {profileGenre}</Animated.Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Form */}
      <View style={styles.form}>
        <Animated.View style={[shakeStyleUsername]}>
          <TextInput
            style={[styles.input, { backgroundColor: mode === "light" ? "#f5f5f5" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]}
            placeholder="Enter username"
            value={username}
            onChangeText={(text) => { setUsername(text); validate("username", text); }}
          />
        </Animated.View>
        {errors.username && <Animated.Text entering={FadeIn} style={styles.error}>{errors.username}</Animated.Text>}

        <Animated.View style={[shakeStyleEmail]}>
          <TextInput
            style={[styles.input, { backgroundColor: mode === "light" ? "#f5f5f5" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => { setEmail(text); validate("email", text); }}
          />
        </Animated.View>
        {errors.email && <Animated.Text entering={FadeIn} style={styles.error}>{errors.email}</Animated.Text>}

        {/* Genres */}
        <View style={styles.genreRow}>
          {genres.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genreOption, { backgroundColor: genre === g ? accentColor : (mode === "light" ? "#f5f5f5" : "#1e1e1e") }]}
              onPress={() => { setGenre(g); validate("genre", g); }}
            >
              <Text style={{ color: genre === g ? "#fff" : (mode === "light" ? "#000" : "#fff") }}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.genre && <Animated.Text entering={FadeIn} style={styles.error}>{errors.genre}</Animated.Text>}

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: accentColor }]} onPress={handleSubmit}>
          <Text style={{ fontWeight: "bold" }}>Submit</Text>
        </TouchableOpacity>
        {success && <Animated.Text entering={FadeIn} style={{ color: "lime", marginTop: 8 }}>{success}</Animated.Text>}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", padding: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  header: { alignItems: "center", paddingTop: 40, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 140, height: 140, borderRadius: 70, marginBottom: 15, borderWidth: 3 },
  name: { fontSize: 26, fontWeight: "bold" },
  email: { fontSize: 14, marginTop: 4 },
  genre: { fontSize: 14, marginTop: 2 },
  form: { paddingHorizontal: 20, marginTop: 20 },
  input: { borderRadius: 8, padding: 12, marginBottom: 8 },
  error: { color: "red", fontSize: 13, marginBottom: 6 },
  genreRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  genreOption: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, margin: 5 },
  submitBtn: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
});
