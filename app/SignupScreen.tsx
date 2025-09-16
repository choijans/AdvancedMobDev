import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#212121', '#000']} // lighter black → darker black
      start={{ x: 1, y: 0 }}       // top-right
      end={{ x: 0, y: 1 }}         // bottom-left
      style={styles.container}
    >
      {/* Logo + Text row */}
      <View style={styles.logoRow}>
        <Image source={require('../assets/images/spot.png')} style={styles.logo} />
        <Text style={styles.logoText}>Spotify</Text>
      </View>

      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#777" />
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#777" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#777" secureTextEntry />

      <Text style={styles.label}>Date Of Birth:</Text>
      <View style={styles.dobRow}>
        <TextInput style={styles.dobInput} placeholder="DD" placeholderTextColor="#777" keyboardType="numeric" />
        <TextInput style={styles.dobInput} placeholder="MM" placeholderTextColor="#777" keyboardType="numeric" />
        <TextInput style={styles.dobInput} placeholder="YY" placeholderTextColor="#777" keyboardType="numeric" />
      </View>

      <View style={styles.genderRow}>
        <TouchableOpacity style={styles.genderOption}>
          <View style={styles.circle} />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.genderOption}>
          <View style={styles.circle} />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/LoginScreen")}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

      <Text style={styles.connectText}>Sign Up With</Text>

      <View style={styles.iconRow}>
        <FontAwesome name="facebook" size={28} color="#fff" style={styles.icon} />
        <FontAwesome name="google" size={28} color="#fff" style={styles.icon} />
      </View>

      <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
        <Text style={styles.bottomText}>
          Already have an account? <Text style={styles.link}>Sign In</Text>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: { width: 60, height: 60, marginRight: 10 },
  logoText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  input: {
    backgroundColor: '#1e1e1e',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  label: {
    color: '#1DB954',
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
    backgroundColor: '#1e1e1e',
    color: '#fff',
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
    borderColor: '#1DB954',
    marginRight: 8,
  },
  genderText: { color: '#fff' },
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
