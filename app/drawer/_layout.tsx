import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";

// Screens
import PlaylistDetailScreen from "./PlaylistDetailScreen"; // 👈 import your detail screen
import PlaylistsScreen from "./PlaylistsScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";
import CameraScreen from "../camera/CameraScreen";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 👉 This stack contains playlists and playlist detail
function PlaylistsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlaylistsScreen"
        component={PlaylistsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetailScreen}
        options={({ route }) => ({
          title: (route.params as any)?.playlistName || "Playlist",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        })}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
            title: "Camera",
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
        }}
    />
    </Stack.Navigator>
  );
}

function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#fff",
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Playlists"
        component={PlaylistsStack} // 👈 use stack instead of screen directly
        options={{
          title: "Playlists",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="music" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#121212" }}>
      <View style={styles.drawerHeader}>
        <FontAwesome name="spotify" size={40} color="#1DB954" />
        <Text style={[styles.drawerTitle, { color: "#fff" }]}>Jansen Choi</Text>
      </View>

      <DrawerItem
        label="Playlists"
        labelStyle={[styles.drawerLabel, { color: "#fff" }]}
        icon={({ size }) => <FontAwesome name="music" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Tabs", { screen: "Playlists" })}
      />
      <DrawerItem
        label="Profile"
        labelStyle={[styles.drawerLabel, { color: "#fff" }]}
        icon={({ size }) => <FontAwesome name="user" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Tabs", { screen: "ProfileScreen" })}
      />
      <DrawerItem
        label="Settings"
        labelStyle={[styles.drawerLabel, { color: "#fff" }]}
        icon={({ size }) => <FontAwesome name="cog" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Tabs", { screen: "SettingsScreen" })}
      />
    </DrawerContentScrollView>
  );
}

// 👇 Simple DrawerLayout without Redux Provider
export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.5)",
        drawerStyle: { width: "70%" },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="Tabs" component={TabsLayout} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerTitle: { fontSize: 20, fontWeight: "bold" },
  drawerLabel: { fontSize: 16 },
});
