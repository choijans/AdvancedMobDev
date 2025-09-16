import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const playlists = [
  {
    id: "1",
    title: "Chill Vibes",
    image: "https://picsum.photos/200/200?random=1",
  },
  {
    id: "2",
    title: "Workout Hits",
    image: "https://picsum.photos/200/200?random=2",
  },
  {
    id: "3",
    title: "Coding Focus",
    image: "https://picsum.photos/200/200?random=3",
  },
  {
    id: "4",
    title: "Party Bangers",
    image: "https://picsum.photos/200/200?random=4",
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Row with Hamburger */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={28} color="#1DB954" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Section */}
      <LinearGradient colors={["#2a2a2a", "#121212"]} style={styles.header}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Jansen Choi Kai Xuan</Text>
        <Text style={styles.followers}>12 Public Playlists • 240 Followers</Text>
      </LinearGradient>

      {/* Playlists Section */}
      <View style={styles.playlistsSection}>
        <Text style={styles.sectionTitle}>Public Playlists</Text>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.playlistRow}>
              <Image source={{ uri: item.image }} style={styles.playlistImage} />
              <Text style={styles.playlistTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
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
    borderColor: "#1DB954",
  },
  name: { color: "#fff", fontSize: 26, fontWeight: "bold", marginBottom: 5 },
  followers: { color: "#bbb", fontSize: 14 },

  playlistsSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
