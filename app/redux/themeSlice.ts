import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeState = {
  mode: "light" | "dark" | "custom";
  accentColor: string;
  isLoaded: boolean;
};

const initialState: ThemeState = {
  mode: "light",
  accentColor: "#1DB954",
  isLoaded: false,
};

// Async thunks for persistence
export const loadTheme = createAsyncThunk(
  "theme/loadTheme",
  async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        return JSON.parse(savedTheme);
      }
      return initialState;
    } catch (error) {
      console.error("Error loading theme:", error);
      return initialState;
    }
  }
);

export const saveTheme = createAsyncThunk(
  "theme/saveTheme",
  async (theme: { mode: "light" | "dark" | "custom"; accentColor: string }) => {
    try {
      await AsyncStorage.setItem("theme", JSON.stringify(theme));
      return theme;
    } catch (error) {
      console.error("Error saving theme:", error);
      throw error;
    }
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<"light" | "dark" | "custom">) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    toggleTheme: (state) => {
      // only toggles between light and dark
      if (state.mode === "light") {
        state.mode = "dark";
      } else if (state.mode === "dark") {
        state.mode = "light";
      } else {
        // if in custom mode, default back to light
        state.mode = "light";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.mode = action.payload.mode;
        state.accentColor = action.payload.accentColor;
        state.isLoaded = true;
      })
      .addCase(loadTheme.rejected, (state) => {
        state.isLoaded = true;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        // Theme already updated in reducers, this is just for confirmation
      });
  },
});

export const { setThemeMode, setAccentColor, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
