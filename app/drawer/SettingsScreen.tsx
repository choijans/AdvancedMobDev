import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { saveTheme, setAccentColor, setThemeMode } from "../redux/themeSlice";

const presetColors = [
  { name: "Spotify Green", color: "#1DB954" },
  { name: "Electric Red", color: "#FF6B6B" },
  { name: "Ocean Blue", color: "#4D96FF" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Orange", color: "#F97316" },
  { name: "Pink", color: "#EC4899" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [notifications, setNotifications] = useState(true);

  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  const isDarkMode = mode === "dark";

  // Animated values
  const bgColor = useSharedValue(mode === "light" ? "#fff" : "#121212");
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");

  // Update animation whenever mode changes
  useEffect(() => {
    if (mode === "light") {
      bgColor.value = withTiming("#fff", { duration: 400 });
      textColor.value = withTiming("#000", { duration: 400 });
    } else {
      bgColor.value = withTiming("#121212", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
    }
  }, [mode]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const handleThemeToggle = (value: boolean) => {
    const newMode = value ? "dark" : "light";
    dispatch(setThemeMode(newMode));
    dispatch(saveTheme({ mode: newMode, accentColor }));
  };

  const handleCustomColor = (colorObj: { name: string; color: string }) => {
    dispatch(setThemeMode("custom"));
    dispatch(setAccentColor(colorObj.color));
    dispatch(saveTheme({ mode: "custom", accentColor: colorObj.color }));
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <FontAwesome name="bars" size={30} color={accentColor} />
        </TouchableOpacity>
        <Animated.Text style={[{ fontSize: 20, marginLeft: 15 }, animatedTextStyle]}>
          Settings
        </Animated.Text>
      </View>

      {/* Notifications */}
      <View style={styles.setting}>
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          Enable Notifications
        </Animated.Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? accentColor : "#888"}
        />
      </View>

      {/* Theme Mode Selector */}
      <View style={styles.setting}>
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          Theme Mode
        </Animated.Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: mode === "light" ? accentColor : "#444" }
            ]}
            onPress={() => dispatch(setThemeMode("light"))}
          >
            <Text style={[styles.themeButtonText, { color: mode === "light" ? "#000" : "#fff" }]}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: mode === "dark" ? accentColor : "#444" }
            ]}
            onPress={() => dispatch(setThemeMode("dark"))}
          >
            <Text style={[styles.themeButtonText, { color: mode === "dark" ? "#000" : "#fff" }]}>
              Dark
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: mode === "custom" ? accentColor : "#444" }
            ]}
            onPress={() => dispatch(setThemeMode("custom"))}
          >
            <Text style={[styles.themeButtonText, { color: mode === "custom" ? "#000" : "#fff" }]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Theme Color Picker */}
      <View style={styles.setting}>
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          Accent Color
        </Animated.Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, flex: 1, justifyContent: "flex-end" }}>
          {presetColors.map((colorObj) => (
            <TouchableOpacity
              key={colorObj.color}
              style={[
                styles.colorCircle,
                { backgroundColor: colorObj.color },
                accentColor === colorObj.color && styles.activeCircle,
              ]}
              onPress={() => handleCustomColor(colorObj)}
            />
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logout, { backgroundColor: accentColor }]}
        onPress={() => router.replace("/LoginScreen")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  text: { fontSize: 16 },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  logout: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
  },
  logoutText: { textAlign: "center", fontWeight: "bold", color: "#000" },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  activeCircle: {
    borderColor: "#FFD700",
    borderWidth: 3,
  },
});
