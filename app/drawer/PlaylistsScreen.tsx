import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

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
  const navigation = useNavigation();
  const [playlists, setPlaylists] = useState<{ id: string; name: string; image: string }[]>([]);
  const [newPlaylist, setNewPlaylist] = useState("");

  // 🔥 Theme from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // Shared animation values
  const bgColor = useSharedValue(mode === "light" ? "#fff" : "#121212");
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const cardColor = useSharedValue(mode === "light" ? "#f2f2f2" : "#282828");
  const inputBg = useSharedValue(mode === "light" ? "#e5e5e5" : "#282828");

  // Animate on theme change
  useEffect(() => {
    if (mode === "light") {
      bgColor.value = withTiming("#fff", { duration: 400 });
      textColor.value = withTiming("#000", { duration: 400 });
      cardColor.value = withTiming("#f2f2f2", { duration: 400 });
      inputBg.value = withTiming("#e5e5e5", { duration: 400 });
    } else {
      bgColor.value = withTiming("#121212", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      cardColor.value = withTiming("#282828", { duration: 400 });
      inputBg.value = withTiming("#282828", { duration: 400 });
    }
  }, [mode]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const animatedCardStyle = useAnimatedStyle(() => ({
    backgroundColor: cardColor.value,
  }));
  const animatedInputStyle = useAnimatedStyle(() => ({
    backgroundColor: inputBg.value,
    color: textColor.value,
  }));

  useEffect(() => {
    const loadPlaylists = async () => {
      const stored = await AsyncStorage.getItem("playlists");
      if (stored) setPlaylists(JSON.parse(stored));
    };
    loadPlaylists();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  const addPlaylist = () => {
    if (!newPlaylist.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: newPlaylist,
      image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
    };
    setPlaylists([...playlists, newItem]);
    setNewPlaylist("");
  };

  const removePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => removePlaylist(id)}>
      <FontAwesome name="trash" size={20} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.ScrollView style={[styles.container, animatedContainerStyle]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <FontAwesome name="bars" size={20} color={accentColor} />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, animatedTextStyle]}>
          Good morning
        </Animated.Text>
      </View>

      {/* Sections */}
      <View style={styles.grid}>
        {goodMorning.map((item) => (
          <Animated.View key={item.id} style={[styles.gridItem, animatedCardStyle]}>
            <TouchableOpacity>
              <Image source={{ uri: item.image }} style={styles.gridImage} />
              <Animated.Text style={[styles.gridText, animatedTextStyle]}>
                {item.title}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Animated.Text style={[styles.sectionTitle, animatedTextStyle]}>
        Made For You
      </Animated.Text>
      <FlatList
        horizontal
        data={madeForYou}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, animatedCardStyle]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Animated.Text style={[styles.cardTitle, animatedTextStyle]}>
              {item.title}
            </Animated.Text>
            <Animated.Text style={[styles.cardSubtitle, animatedTextStyle]}>
              {item.subtitle}
            </Animated.Text>
          </Animated.View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      />

      <Animated.Text style={[styles.sectionTitle, animatedTextStyle]}>
        Popular playlists
      </Animated.Text>
      <FlatList
        horizontal
        data={popular}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, animatedCardStyle]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Animated.Text style={[styles.cardTitle, animatedTextStyle]}>
              {item.title}
            </Animated.Text>
          </Animated.View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      />

      {/* Your Playlists */}
      <Animated.Text style={[styles.sectionTitle, animatedTextStyle]}>
        Your Playlists
      </Animated.Text>
      <View style={styles.playlistInputRow}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: mode === "light" ? "#e5e5e5" : "#282828",
            color: mode === "light" ? "#000" : "#fff"
          }]}
          placeholder="New playlist name"
          placeholderTextColor="#888"
          value={newPlaylist}
          onChangeText={setNewPlaylist}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: accentColor }]} onPress={addPlaylist}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {playlists.map((playlist) => (
        <Swipeable
          key={playlist.id}
          renderRightActions={() => renderRightActions(playlist.id)}
          overshootRight={false}
        >
          <Animated.View style={[styles.playlistCard, animatedCardStyle]}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() =>
                (navigation as any).navigate(
                  "PlaylistDetail",
                  { playlistId: playlist.id, playlistName: playlist.name }
                )
              }
            >
              <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
              <Animated.Text style={[styles.playlistName, animatedTextStyle]}>
                {playlist.name}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Swipeable>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
    paddingRight: 10,
  },
  gridImage: { width: 50, height: 50 },
  gridText: { marginLeft: 10, flexShrink: 1 },

  card: { marginRight: 15, width: 140, borderRadius: 6, padding: 5 },
  cardImage: { width: "100%", height: 140, borderRadius: 6, marginBottom: 8 },
  cardTitle: { fontWeight: "600", fontSize: 14 },
  cardSubtitle: { fontSize: 12 },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginLeft: 10 },

  playlistInputRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: { flex: 1, padding: 10, borderRadius: 6, marginRight: 10 },
  addButton: { padding: 10, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "bold" },

  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  playlistImage: { width: 50, height: 50, borderRadius: 6, marginRight: 10 },
  playlistName: { fontSize: 16 },

  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 6,
    marginBottom: 10,
  },
  deleteText: { color: "#fff", fontWeight: "bold", marginTop: 5 },
});
