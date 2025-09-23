import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
  const navigation = useNavigation();

  // Theme from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // profile data
  const [profileUsername, setProfileUsername] = useState("jansen choi kai xuan");
  const [profileEmail, setProfileEmail] = useState("janchoi@gmail.com");
  const [profileGenre, setProfileGenre] = useState("Hip-Hop");
  const [avatar, setAvatar] = useState<any>(defaultAvatar);

  // form data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; genre?: string }>({});
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // animations
  const fadeIn = useSharedValue(0);
  const shakeXUsername = useSharedValue(0);
  const shakeXEmail = useSharedValue(0);

  // Theme animations
  const bgColor = useSharedValue(mode === "light" ? "#fff" : "#121212");
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const inputBgColor = useSharedValue(mode === "light" ? "#f5f5f5" : "#1e1e1e");
  const headerTextColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const gradientStart = useSharedValue(mode === "light" ? "#f0f0f0" : "#2a2a2a");
  const gradientEnd = useSharedValue(mode === "light" ? "#e0e0e0" : "#121212");

  useEffect(() => {
    if (mode === "light") {
      bgColor.value = withTiming("#fff", { duration: 400 });
      textColor.value = withTiming("#000", { duration: 400 });
      inputBgColor.value = withTiming("#f5f5f5", { duration: 400 });
      headerTextColor.value = withTiming("#000", { duration: 400 });
      gradientStart.value = withTiming("#f0f0f0", { duration: 400 });
      gradientEnd.value = withTiming("#e0e0e0", { duration: 400 });
    } else if (mode === "dark") {
      bgColor.value = withTiming("#121212", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      inputBgColor.value = withTiming("#1e1e1e", { duration: 400 });
      headerTextColor.value = withTiming("#fff", { duration: 400 });
      gradientStart.value = withTiming("#2a2a2a", { duration: 400 });
      gradientEnd.value = withTiming("#121212", { duration: 400 });
    } else {
      // custom theme
      bgColor.value = withTiming("#121212", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      inputBgColor.value = withTiming("#1e1e1e", { duration: 400 });
      headerTextColor.value = withTiming("#fff", { duration: 400 });
      gradientStart.value = withTiming("#2a2a2a", { duration: 400 });
      gradientEnd.value = withTiming("#121212", { duration: 400 });
    }
  }, [mode]);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 600 });
    loadCache();
  }, []);

  const animatedProfileStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const animatedHeaderTextStyle = useAnimatedStyle(() => ({
    color: headerTextColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    backgroundColor: inputBgColor.value,
    color: textColor.value,
  }));

  const shakeStyleUsername = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeXUsername.value }],
  }));

  const shakeStyleEmail = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeXEmail.value }],
  }));

  const triggerShake = (field: "username" | "email") => {
    const target = field === "username" ? shakeXUsername : shakeXEmail;
    target.value = withSequence(
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  // validation (no shake here!)
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

  // cache
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
        setAvatar(data.avatar || defaultAvatar);
      }
    } catch (e) {
      console.log("Cache load error", e);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    validate("username", username);
    validate("email", email);
    validate("genre", genre);

    // trigger shake ONLY after submit if errors exist
    if (errors.username) triggerShake("username");
    if (errors.email) triggerShake("email");

    if (!errors.username && !errors.email && !errors.genre) {
      setProfileUsername(username);
      setProfileEmail(email);
      setProfileGenre(genre);

      const newData = { username, email, genre, avatar };
      await saveCache(newData);

      setSuccess("Profile updated successfully!");

      setUsername("");
      setEmail("");
      setGenre("");
      setErrors({});
      setSubmitted(false);

      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar({ uri: result.assets[0].uri });
    }
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

      {/* Dynamic Profile */}
      <Animated.View style={[animatedProfileStyle]}>
        <LinearGradient 
          colors={mode === "light" ? ["#f0f0f0", "#e0e0e0"] : ["#2a2a2a", "#121212"]} 
          style={styles.header}
        >
          <TouchableOpacity onPress={pickImage}>
            <Image source={avatar} style={[styles.avatar, { borderColor: accentColor }]} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Animated.Text style={[styles.name, { color: mode === "light" ? "#000" : "#fff" }]}>{profileUsername || "Your Name"}</Animated.Text>
            <Animated.Text style={[styles.email, { color: mode === "light" ? "#666" : "#bbb" }]}>{profileEmail || "your@email.com"}</Animated.Text>
            <Animated.Text style={[styles.genre, { color: mode === "light" ? "#666" : "#bbb" }]}>
              Favorite genre: {profileGenre || "Not selected"}
            </Animated.Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Form */}
      <View style={styles.form}>
        {/* Username */}
        <Animated.View style={[shakeStyleUsername]}>
          <TextInput
            style={[styles.input, { backgroundColor: mode === "light" ? "#f5f5f5" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]}
            placeholder="Enter username"
            placeholderTextColor={mode === "light" ? "#666" : "#888"}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validate("username", text);
            }}
          />
        </Animated.View>
        {errors.username ? (
          <Animated.Text entering={FadeIn} style={styles.error}>
            {errors.username}
          </Animated.Text>
        ) : null}

        {/* Email */}
        <Animated.View style={[shakeStyleEmail]}>
          <TextInput
            style={[styles.input, { backgroundColor: mode === "light" ? "#f5f5f5" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]}
            placeholder="Enter email"
            placeholderTextColor={mode === "light" ? "#666" : "#888"}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validate("email", text);
            }}
          />
        </Animated.View>
        {errors.email ? (
          <Animated.Text entering={FadeIn} style={styles.error}>
            {errors.email}
          </Animated.Text>
        ) : null}

        {/* Genre */}
        <View style={styles.genreRow}>
          {genres.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genreOption, 
                { backgroundColor: mode === "light" ? "#f5f5f5" : "#1e1e1e" },
                genre === g && { backgroundColor: accentColor }
              ]}
              onPress={() => {
                setGenre(g);
                validate("genre", g);
              }}
            >
              <Text
                style={[
                  styles.genreText,
                  { color: mode === "light" ? "#000" : "#fff" },
                  genre === g && { color: mode === "custom" ? "#fff" : "#000", fontWeight: "bold" },
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.genre ? (
          <Animated.Text entering={FadeIn} style={styles.error}>
            {errors.genre}
          </Animated.Text>
        ) : null}

        {/* Submit */}
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: accentColor }]} onPress={handleSubmit}>
          <Text style={[styles.submitText, { color: mode === "custom" ? "#fff" : "#000" }]}>Submit</Text>
        </TouchableOpacity>

        {success ? (
          <Animated.Text
            entering={FadeIn}
            style={{ color: "lime", fontSize: 14, marginTop: 8 }}
          >
            {success}
          </Animated.Text>
        ) : null}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
    borderWidth: 3,
  },
  name: { fontSize: 26, fontWeight: "bold" },
  email: { fontSize: 14, marginTop: 4 },
  genre: { fontSize: 14, marginTop: 2 },
  form: { paddingHorizontal: 20, marginTop: 20 },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  error: { color: "red", fontSize: 13, marginBottom: 6 },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  genreOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  genreText: {},
  genreTextSelected: { fontWeight: "bold" },
  submitBtn: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { fontWeight: "bold" },
});

