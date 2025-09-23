import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useReducer, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Song {
  id: string;
  title: string;
  image: string;
}

interface State {
  songs: Song[];
  past: Song[][];
  future: Song[][];
}

type Action =
  | { type: "ADD"; title: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; songs: Song[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const newSong = {
        id: Date.now().toString(),
        title: action.title,
        image: `https://picsum.photos/200/200?random=${Math.floor(
          Math.random() * 1000
        )}`,
      };
      const newSongs = [...state.songs, newSong];
      return { songs: newSongs, past: [...state.past, state.songs], future: [] };
    }
    case "REMOVE": {
      const newSongs = state.songs.filter((s) => s.id !== action.id);
      return { songs: newSongs, past: [...state.past, state.songs], future: [] };
    }
    case "CLEAR": {
      return { songs: [], past: [...state.past, state.songs], future: [] };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return { songs: prev, past: newPast, future: [state.songs, ...state.future] };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { songs: next, past: [...state.past, state.songs], future: rest };
    }
    case "SET": {
      return { ...state, songs: action.songs };
    }
    default:
      return state;
  }
}

export default function PlaylistDetailScreen() {
  const route = useRoute<
    RouteProp<{ params: { playlistId: string; playlistName: string } }, "params">
  >();
  const { playlistId, playlistName } = route.params;

  const [state, dispatch] = useReducer(reducer, { songs: [], past: [], future: [] });
  const [newSong, setNewSong] = useState("");

  // 🎨 Theme from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);

  // Animated theme colors
  const bgColor = useSharedValue(mode === "light" ? "#fff" : "#000");
  const textColor = useSharedValue(mode === "light" ? "#000" : "#fff");
  const cardBg = useSharedValue(mode === "light" ? "#f2f2f2" : "#1e1e1e");

  useEffect(() => {
    if (mode === "light") {
      bgColor.value = withTiming("#fff", { duration: 400 });
      textColor.value = withTiming("#000", { duration: 400 });
      cardBg.value = withTiming("#f2f2f2", { duration: 400 });
    } else if (mode === "dark") {
      bgColor.value = withTiming("#000", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      cardBg.value = withTiming("#1e1e1e", { duration: 400 });
    } else {
      // custom → base dark bg but custom accent already applied
      bgColor.value = withTiming("#121212", { duration: 400 });
      textColor.value = withTiming("#fff", { duration: 400 });
      cardBg.value = withTiming("#1e1e1e", { duration: 400 });
    }
  }, [mode]);

  // Animated styles
  const animatedContainer = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));
  const animatedText = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const animatedCard = useAnimatedStyle(() => ({
    backgroundColor: cardBg.value,
  }));

  // Data persistence
  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    saveSongs();
  }, [state.songs]);

  const loadSongs = async () => {
    const stored = await AsyncStorage.getItem(`playlist_${playlistId}`);
    if (stored) {
      dispatch({ type: "SET", songs: JSON.parse(stored) });
    }
  };

  const saveSongs = async () => {
    await AsyncStorage.setItem(`playlist_${playlistId}`, JSON.stringify(state.songs));
  };

  const addSong = () => {
    if (!newSong.trim()) return;
    dispatch({ type: "ADD", title: newSong });
    setNewSong("");
  };

  const removeSong = (id: string) => {
    dispatch({ type: "REMOVE", id });
  };



  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <Animated.Text style={[styles.title, animatedText]}>{playlistName}</Animated.Text>

      {/* Song input */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { backgroundColor: mode === 'light' ? '#e5e5e5' : '#1e1e1e', color: mode === 'light' ? '#000' : '#fff' }]}
          placeholder="Enter song name"
          placeholderTextColor="#aaa"
          value={newSong}
          onChangeText={setNewSong}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: accentColor }]}
          onPress={addSong}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Songs list */}
      <FlatList
        data={state.songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={[styles.songRow, animatedCard]}
          >
            <View style={styles.songRowContent}>
              <Image source={{ uri: item.image }} style={styles.songImage} />
              <Animated.Text style={[styles.songTitle, animatedText]}>
                {item.title}
              </Animated.Text>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => removeSong(item.id)}
              >
                <FontAwesome name="trash" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => dispatch({ type: "UNDO" })}>
          <Text style={[styles.controlText, { color: accentColor }]}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "REDO" })}>
          <Text style={[styles.controlText, { color: accentColor }]}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
          <Text style={[styles.controlText, { color: accentColor }]}>Clear</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  songRow: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  songRowContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  songImage: { width: 40, height: 40, borderRadius: 6, marginRight: 12 },
  songTitle: { fontSize: 16, flex: 1 },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  controlText: { fontSize: 16, fontWeight: "bold" },
});
