import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { loadTheme } from "./redux/themeSlice";

function AppContent() {
  useEffect(() => {
    // Load theme after store is ready
    store.dispatch(loadTheme());
  }, []);

  return <Stack />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}
