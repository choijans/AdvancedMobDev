import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with Hamburger */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={28} color="#1DB954" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Gradient Header */}
      <LinearGradient
        colors={["#2a2a2a", "#121212"]}
        style={styles.header}
      >
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Jansen Choi Kai Xuan</Text>
        <Text style={styles.email}>jansenchoi@example.com</Text>
      </LinearGradient>

      {/* Profile Actions */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonOutlineText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#1DB954",
  },
  name: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  email: { color: "#bbb", fontSize: 14 },

  card: {
    backgroundColor: "#1e1e1e",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  button: {
    backgroundColor: "#1DB954",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },

  buttonOutline: {
    borderWidth: 1,
    borderColor: "#1DB954",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonOutlineText: { color: "#1DB954", fontWeight: "600", fontSize: 16 },
});
