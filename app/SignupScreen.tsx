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

export default function SignupScreen() {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // Animated values for theme transitions
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const buttonColor = useSharedValue(accentColor);

  useEffect(() => {
    if (mode === "light") {
      textColor.value = withTiming("#000", { duration: 400 });
    } else {
      textColor.value = withTiming("#fff", { duration: 400 });
    }
    buttonColor.value = withTiming(accentColor, { duration: 400 });
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
        mode === "light" ? "#f0f4ff" : "#212121",
        mode === "light" ? "#a2b6ff" : "#000"
      ]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Logo + Text row */}
      <View style={styles.logoRow}>
        <Image source={require('../assets/images/spot.png')} style={styles.logo} />
        <Animated.Text style={[styles.logoText, animatedTextStyle]}>Spotify</Animated.Text>
      </View>

      <TextInput 
        style={[styles.input, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
        placeholder="Email Address" 
        placeholderTextColor={mode === "light" ? "#777" : "#999"} 
      />
      <TextInput 
        style={[styles.input, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
        placeholder="Full Name" 
        placeholderTextColor={mode === "light" ? "#777" : "#999"} 
      />
      <TextInput 
        style={[styles.input, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
        placeholder="Password" 
        placeholderTextColor={mode === "light" ? "#777" : "#999"} 
        secureTextEntry 
      />

      <Animated.Text style={[styles.label, { color: accentColor }]}>Date Of Birth:</Animated.Text>
      <View style={styles.dobRow}>
        <TextInput 
          style={[styles.dobInput, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
          placeholder="DD" 
          placeholderTextColor={mode === "light" ? "#777" : "#999"} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={[styles.dobInput, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
          placeholder="MM" 
          placeholderTextColor={mode === "light" ? "#777" : "#999"} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={[styles.dobInput, { backgroundColor: mode === "light" ? "#fff" : "#1e1e1e", color: mode === "light" ? "#000" : "#fff" }]} 
          placeholder="YY" 
          placeholderTextColor={mode === "light" ? "#777" : "#999"} 
          keyboardType="numeric" 
        />
      </View>

      <View style={styles.genderRow}>
        <TouchableOpacity style={styles.genderOption}>
          <View style={[styles.circle, { borderColor: mode === "light" ? "#ccc" : "#fff" }]} />
          <Animated.Text style={[styles.genderText, animatedTextStyle]}>Male</Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.genderOption}>
          <View style={[styles.circle, { borderColor: mode === "light" ? "#ccc" : "#fff" }]} />
          <Animated.Text style={[styles.genderText, animatedTextStyle]}>Female</Animated.Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/LoginScreen")}>
        <Animated.View style={[styles.buttonInner, animatedButtonStyle]}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.Text style={[styles.connectText, animatedTextStyle]}>Sign Up With</Animated.Text>

      <View style={styles.iconRow}>
        <FontAwesome name="facebook" size={28} color={accentColor} style={styles.icon} />
        <FontAwesome name="google" size={28} color={accentColor} style={styles.icon} />
      </View>

      <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
        <Animated.Text style={[styles.bottomText, animatedTextStyle]}>
          Already have an account? <Text style={[styles.link, { color: accentColor }]}>Sign In</Text>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: { width: 60, height: 60, marginRight: 10 },
  logoText: { fontSize: 32, fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  dobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dobInput: {
    padding: 10,
    borderRadius: 8,
    width: '30%',
    textAlign: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 8,
  },
  genderText: {},
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
