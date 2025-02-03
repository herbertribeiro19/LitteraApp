import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Para ícones
import { House, CirclePlus } from "lucide-react-native";

import Welcome from "./src/views/Welcome";
import Login from "./src/views/Login";
import Register from "./src/views/Register";
import Home from "./src/views/Home";
import CreateBook from "./src/views/CreateBook";
import EditUser from "./src/views/EditUser";
import Preferencies from "./src/views/Preferencies";

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
          height: 110, // Ajuste a altura do tab bar se necessário
          justifyContent: "center", // Garante que os itens sejam centralizados
          position: "center",
          borderRadius: 16,
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
        {/* Alterado para HomeTabs */}
        <Stack.Screen name="HomeTabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import React, { useState, useEffect } from "react";
// import { StyleSheet, Text, View, Image } from "react-native";
// import AppIntroSlider from "react-native-app-intro-slider";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Home from "./src/Pages/Home";
// import Login from "./src/Pages/Login";

// const slides = [
//   {
//     id: 1,
//     title: "Only Books Can Help You",
//     description:
//       "Books can help you to increase your knowledge and become more successfully.",
//     image: require("./src/assets/_476871824.png"),
//   },
//   {
//     id: 2,
//     title: "Learn Smartly",
//     description:
//       "It’s 2022 and it’s time to learn every quickly and smartly. All books are storage in cloud and you can access all of them from your laptop or PC. ",
//     image: require("./src/assets/Group 1.png"),
//   },
//   {
//     id: 3,
//     title: "Text Book Has Power To Chnage Everything",
//     description:
//       "We have true friend in our life and the books is that. Book has power to change yourself and make you more valueable.",
//     image: require("./src/assets/Group 32.png"),
//   },
// ];

// export default function App() {
//   const [showHomePage, setShowHomePage] = useState(false);

//   useEffect(() => {
//     const checkIfOnboardingShown = async () => {
//       const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
//       if (hasSeenOnboarding) {
//         setShowHomePage(true);
//       }
//     };

//     checkIfOnboardingShown();
//   }, []);

//   const handleDone = async () => {
//     await AsyncStorage.setItem("hasSeenOnboarding", "true");
//     setShowHomePage(true);
//   };

//   // const buttonLabel = (label) => {
//   //   return (
//   //     <View style={styles.button}>
//   //       <Text style={styles.buttonText}>{label}</Text>
//   //     </View>
//   //   );
//   // };

//   if (!showHomePage) {
//     return (
//       <AppIntroSlider
//         data={slides}
//         renderItem={({ item }) => {
//           return (
//             <View style={styles.box}>
//               <Image
//                 source={item.image}
//                 style={styles.image}
//                 resizeMode="contain"
//               />
//               <Text style={styles.title}>{item.title}</Text>
//               <Text style={styles.description}>{item.description}</Text>
//             </View>
//           );
//         }}
//         activeDotStyle={{
//           backgroundColor: "#631C11",
//           width: 30,
//         }}
//         renderNextButton={() => {
//           return (
//             <View style={styles.buttonCircle}>
//               <AntDesign name="arrowright" size={30} color="#631C11" />
//             </View>
//           );
//         }}
//         renderDoneButton={() => {
//           return (
//             <View style={styles.buttonCircle}>
//               <AntDesign name="checkcircleo" size={30} color="#631C11" />
//             </View>
//           );
//         }}
//         // renderNextButton={() => buttonLabel("Next")}
//         // renderDoneButton={() => buttonLabel("GetStarted")}
//         onDone={() => {
//           setShowHomePage(true);
//         }}
//       />
//     );
//   }

//   return <Login />;
// }

// const styles = StyleSheet.create({
//   box: {
//     flex: 1,
//     alignItems: "center",
//     padding: 10,
//     paddingTop: 60,
//   },
//   image: {
//     width: "90%",
//     height: "70%",
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     justifyContent: "center",
//     textAlign: "center",
//   },
//   description: {
//     fontSize: 14,
//     justifyContent: "center",
//     textAlign: "center",
//     margin: 10,
//   },
//   buttonCircle: {
//     width: 40,
//     height: 40,
//     backgroundColor: "rgba(0, 0, 0, .2)",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
