import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

export default function LoginScreen() {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // Animated values for theme transitions
  const bgColor1 = useSharedValue(mode === "light" ? "#f0f4ff" : "#212121");
  const bgColor2 = useSharedValue(mode === "light" ? "#a2b6ff" : "#000");
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const inputBgColor = useSharedValue(mode === "light" ? "#fff" : "#1e1e1e");
  const buttonColor = useSharedValue(accentColor);

  useEffect(() => {
    if (mode === "light") {
      bgColor1.value = withTiming("#f0f4ff", { duration: 400 });
      bgColor2.value = withTiming("#a2b6ff", { duration: 400 });
      textColor.value = withTiming("#000", { duration: 400 });
      inputBgColor.value = withTiming("#fff", { duration: 400 });
    } else {
      bgColor1.value = withTiming("#212121", { duration: 400 });
      bgColor2.value = withTiming("#000", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      inputBgColor.value = withTiming("#1e1e1e", { duration: 400 });
    }
    buttonColor.value = withTiming(accentColor, { duration: 400 });
  }, [mode, accentColor]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    backgroundColor: inputBgColor.value,
    color: textColor.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
  }));

  return (
    <LinearGradient
      colors={[
        mode === "light" ? "#f0f4ff" : "#212121",
        mode === "light" ? "#a2b6ff" : "#000"
      ]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Image source={require('../assets/images/spot.png')} style={styles.logo} />
      <Animated.Text style={[styles.logoText, animatedTextStyle]}>Spotify</Animated.Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
          placeholder="Username" 
          placeholderTextColor={mode === "light" ? "#777" : "#999"} 
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
          placeholder="Password" 
          placeholderTextColor={mode === "light" ? "#777" : "#999"} 
          secureTextEntry 
        />
      </View>

      <Animated.Text style={[styles.forgot, animatedTextStyle]}>Forgot password?</Animated.Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/drawer/PlaylistsScreen")}>
        <Animated.View style={[styles.buttonInner, animatedButtonStyle]}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.Text style={[styles.connectText, animatedTextStyle]}>Or Connect With</Animated.Text>

      <View style={styles.iconRow}>
        <FontAwesome name="facebook" size={28} color={accentColor} style={styles.icon} />
        <FontAwesome name="google" size={28} color={accentColor} style={styles.icon} />
      </View>

      <TouchableOpacity onPress={() => router.push('/SignupScreen')}>
        <Animated.Text style={[styles.bottomText, animatedTextStyle]}>
          Don't have an account? <Text style={[styles.link, { color: accentColor }]}>Sign Up</Text>
        </Animated.Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: { width: 100, height: 100, marginBottom: 20 },
  logoText: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 15 },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
  },
  forgot: { alignSelf: 'flex-end', marginBottom: 20 },
  button: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 30,
    overflow: 'hidden',
  },
  buttonInner: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#000', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  connectText: { marginBottom: 10 },
  iconRow: { flexDirection: 'row', marginBottom: 30 },
  icon: { marginHorizontal: 10 },
  bottomText: { fontSize: 14 },
  link: { fontWeight: 'bold' },
});
