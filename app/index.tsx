import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

export default function HomeScreen() {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // Animated values for theme transitions
  const bgColor1 = useSharedValue(mode === "light" ? "#f0f4ff" : "#121212");
  const bgColor2 = useSharedValue(mode === "light" ? "#a2b6ff" : "#000");
  const textColor = useSharedValue(mode === "light" ? "#1a1a1a" : "#fff");
  const buttonColor = useSharedValue(mode === "light" ? "#4f6cff" : accentColor);

  useEffect(() => {
    if (mode === "light") {
      bgColor1.value = withTiming("#f0f4ff", { duration: 400 });
      bgColor2.value = withTiming("#a2b6ff", { duration: 400 });
      textColor.value = withTiming("#1a1a1a", { duration: 400 });
      buttonColor.value = withTiming("#4f6cff", { duration: 400 });
    } else {
      bgColor1.value = withTiming("#121212", { duration: 400 });
      bgColor2.value = withTiming("#000", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      buttonColor.value = withTiming(accentColor, { duration: 400 });
    }
  }, [mode, accentColor]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
  }));

  return (
    <LinearGradient
      colors={[
        mode === "light" ? "#f0f4ff" : "#121212",
        mode === "light" ? "#a2b6ff" : "#000"
      ]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Animated.Text style={[styles.title, animatedTextStyle]}>Welcome to the App 🎵</Animated.Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/LoginScreen")}
      >
        <Animated.View style={[styles.buttonInner, animatedButtonStyle]}>
          <Text style={styles.buttonText}>Login</Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/SignupScreen")}
      >
        <Animated.View style={[styles.buttonInner, animatedButtonStyle]}>
          <Text style={styles.buttonText}>Signup</Text>
        </Animated.View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "80%",
    marginBottom: 15,
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonInner: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
