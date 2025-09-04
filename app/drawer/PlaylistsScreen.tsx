import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native"; // 👈 add this
import { FontAwesome } from "@expo/vector-icons";

const goodMorning = [
  { id: "1", title: "Today's Top Hits", image: "https://picsum.photos/200/200?random=1" },
  { id: "2", title: "Dope Labs", image: "https://picsum.photos/200/200?random=2" },
  { id: "3", title: "Chill Hits", image: "https://picsum.photos/200/200?random=3" },
  { id: "4", title: "Latina to Latina", image: "https://picsum.photos/200/200?random=4" },
];

const madeForYou = [
  { id: "5", title: "On Repeat", subtitle: "Songs you can’t get enough of", image: "https://picsum.photos/200/200?random=5" },
  { id: "6", title: "Your Discover Weekly", subtitle: "Your weekly mixtape", image: "https://picsum.photos/200/200?random=6" },
];

const popular = [
  { id: "7", title: "Feelin' Good", image: "https://picsum.photos/200/200?random=7" },
  { id: "8", title: "Pumped Pop", image: "https://picsum.photos/200/200?random=8" },
  { id: "9", title: "Chill Mix", image: "https://picsum.photos/200/200?random=9" },
];

export default function PlaylistsScreen() {
  const navigation = useNavigation(); // 👈 now navigation is available

  return (
    <ScrollView style={styles.container}>
      {/* Custom Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <FontAwesome name="bars" size={20} color="#1DB954" /> {/* Change color here */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Good morning</Text>
      </View>

      {/* Good Morning Section */}
      <View style={styles.grid}>
        {goodMorning.map((item) => (
          <TouchableOpacity key={item.id} style={styles.gridItem}>
            <Image source={{ uri: item.image }} style={styles.gridImage} />
            <Text style={styles.gridText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Made for You Section */}
      <Text style={styles.sectionTitle}>Made For You</Text>
      <FlatList
        horizontal
        data={madeForYou}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      />

      {/* Popular Playlists */}
      <Text style={styles.sectionTitle}>Popular playlists</Text>
      <FlatList
        horizontal
        data={popular}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingHorizontal: 15, paddingTop: 20 },
  sectionTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridItem: {
    backgroundColor: "#282828",
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
    paddingRight: 10,
  },
  gridImage: { width: 50, height: 50 },
  gridText: { color: "#fff", marginLeft: 10, flexShrink: 1 },

  card: { marginRight: 15, width: 140 },
  cardImage: { width: "100%", height: 140, borderRadius: 6, marginBottom: 8 },
  cardTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cardSubtitle: { color: "#aaa", fontSize: 12 },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
});
