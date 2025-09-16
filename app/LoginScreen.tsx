import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#212121', '#000']}  // lighter black → darker black
      start={{ x: 1, y: 0 }}        // top-right
      end={{ x: 0, y: 1 }}          // bottom-left
      style={styles.container}
    >
      <Image source={require('../assets/images/spot.png')} style={styles.logo} />
      <Text style={styles.logoText}>Spotify</Text>

      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#777" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#777" secureTextEntry />

      <Text style={styles.forgot}>Forgot password?</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/drawer/PlaylistsScreen")}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.connectText}>Or Connect With</Text>

      <View style={styles.iconRow}>
        <FontAwesome name="facebook" size={28} color="#fff" style={styles.icon} />
        <FontAwesome name="google" size={28} color="#fff" style={styles.icon} />
      </View>

      <TouchableOpacity onPress={() => router.push('/SignupScreen')}>
        <Text style={styles.bottomText}>
          Don't have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
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
  logoText: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  input: {
    backgroundColor: '#1e1e1e',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  forgot: { color: '#888', alignSelf: 'flex-end', marginBottom: 20 },
  button: {
    backgroundColor: '#1DB954',
    width: '100%',
    padding: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  buttonText: { color: '#000', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  connectText: { color: '#999', marginBottom: 10 },
  iconRow: { flexDirection: 'row', marginBottom: 30 },
  icon: { marginHorizontal: 10 },
  bottomText: { color: '#999', fontSize: 14 },
  link: { color: '#1DB954', fontWeight: 'bold' },
});
