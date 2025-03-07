import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  House,
  CirclePlus,
  UserRound,
  Ticket,
  Search,
} from "lucide-react-native";

import Welcome from "./src/views/Welcome";
import Login from "./src/views/Login";
import Register from "./src/views/Register";
import Home from "./src/views/Home";
import CreateBook from "./src/views/CreateBook";
import EditUser from "./src/views/EditUser";
import Preferencies from "./src/views/Preferencies";
import DetailsBook from "./src/views/DetailsBook";
import Profile from "./src/views/Profile";
import Events from "./src/views/Events";
import SearchBar from "./src/views/SearchBar";
import UserAnuncios from "./src/views/UserAnuncios";
import LitterAI from "./src/views/LitterAI";
import Notification from "./src/views/Notification";
import InteressadoDetails from "./src/views/InteressadoDetails";
import EditBook from "./src/views/EditBook";
import MeusInteresses from "./src/views/MeusInteresses";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#631C11",
          borderColor: "#631C11",
          height: 86, // Ajuste a altura do tab bar se necessário
          justifyContent: "center", // Garante que os itens sejam centralizados
          position: "center",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <House
              size={26}
              color={focused ? "#fff" : "#B6B6B6"} // Cor do ícone quando está selecionado (focused) ou desabilitado
            />
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: {
            alignSelf: "center",
            marginTop: 10,
          },
        }}
      />
      <Tab.Screen
        name="SearchBar"
        component={SearchBar}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Search
              size={26}
              color={focused ? "#fff" : "#B6B6B6"} // Cor do ícone quando está selecionado (focused) ou desabilitado
            />
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: {
            alignSelf: "center",
            marginTop: 10,
          },
        }}
      />

      <Tab.Screen
        name="Create"
        component={CreateBook}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <CirclePlus
              size={26}
              color={focused ? "#fff" : "#B6B6B6"} // Cor do ícone quando está selecionado (focused) ou desabilitado
            />
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: {
            alignSelf: "center",
            marginTop: 10,
          },
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ticket
              size={26}
              color={focused ? "#fff" : "#B6B6B6"} // Cor do ícone quando está selecionado (focused) ou desabilitado
            />
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: {
            alignSelf: "center",
            marginTop: 10,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <UserRound
              size={26}
              color={focused ? "#fff" : "#B6B6B6"} // Cor do ícone quando está selecionado (focused) ou desabilitado
            />
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: {
            alignSelf: "center",
            marginTop: 10,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

        if (isLoggedIn !== "true") {
          setInitialRoute("Login");
          return;
        }

        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          setInitialRoute("Login");
          return;
        }

        let hasSelectedPreferences = await AsyncStorage.getItem(
          `hasSelectedPreferences_${userId}`
        );

        // Tratar valores nulos ou inexistentes como "false"
        if (!hasSelectedPreferences) {
          hasSelectedPreferences = "false";
        }

        console.log("isLoggedIn:", isLoggedIn);
        console.log("hasSelectedPreferences:", hasSelectedPreferences);

        if (hasSelectedPreferences === "true") {
          setInitialRoute("HomeTabs");
        } else {
          setInitialRoute("Preferencies");
        }
      } catch (error) {
        console.log("Erro ao acessar AsyncStorage:", error);
        setInitialRoute("Welcome");
      }
    };

    checkLoginStatus();
  }, []);

  if (!initialRoute) return null; // Evita piscar tela enquanto carrega

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="Preferencies" component={Preferencies} />
        <Stack.Screen name="DetailsBook" component={DetailsBook} />
        <Stack.Screen name="UserAnuncios" component={UserAnuncios} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="SearchBar" component={SearchBar} />
        <Stack.Screen name="LitterAI" component={LitterAI} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="EditBook" component={EditBook} />
        <Stack.Screen name="MeusInteresses" component={MeusInteresses} />
        <Stack.Screen
          name="InteressadoDetails"
          component={InteressadoDetails}
        />
        {/* Alterado para HomeTabs */}
        <Stack.Screen name="HomeTabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
