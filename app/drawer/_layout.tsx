// app/drawer/_layout.tsx
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

// import your screens (make sure they are in the same folder)
import PlaylistsScreen from "./PlaylistsScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

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
        name="PlaylistsScreen"
        component={PlaylistsScreen}
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
        <Text style={styles.drawerTitle}>Jansen Choi</Text>
      </View>

      <DrawerItem
        label="Playlists"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => <FontAwesome name="music" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Tabs", { screen: "PlaylistsScreen" })}
      />
      <DrawerItem
        label="Profile"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => <FontAwesome name="user" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Tabs", { screen: "ProfileScreen" })}
      />
      <DrawerItem
        label="Settings"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => <FontAwesome name="cog" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Tabs", { screen: "SettingsScreen" })}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front", // 👈 hover over content
        overlayColor: "rgba(0,0,0,0.5)", // semi-transparent background
        sceneContainerStyle: { backgroundColor: "#000" },
        drawerStyle: { width: "70%", backgroundColor: "#121212" },
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
  drawerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  drawerLabel: { color: "#fff", fontSize: 16 },
});
