import { Stack } from "expo-router";
import { useEffect } from "react";
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
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
