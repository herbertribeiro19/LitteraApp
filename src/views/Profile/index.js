import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Settings,
  BookOpen,
  LogOut,
  ChevronRight,
  KeyIcon,
  MessageCircleHeart,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      // Buscar o userId antes de limpar os dados
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        console.log("Erro: Nenhum usuário logado.");
        return;
      }

      // Remover apenas os dados de login
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");

      // Redirecionar para a tela de Login
      requestAnimationFrame(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      });
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: handleLogout },
      ],
      { cancelable: false }
    );
  };

  const options = [
    {
      icon: <User size={24} color="#631C11" />,
      title: "Editar Perfil",
      onPress: () => navigation.navigate("EditUser"),
    },
    {
      icon: <Settings size={24} color="#631C11" />,
      title: "Atualizar Preferências",
      onPress: () => navigation.navigate("Preferencies"),
    },
    {
      icon: <MessageCircleHeart size={24} color="#631C11" />,
      title: "Meus Interesses",
      onPress: () => navigation.navigate("MeusInteresses"),
    },
    {
      icon: <BookOpen size={24} color="#631C11" />,
      title: "Meus Anúncios",
      onPress: () => navigation.navigate("UserAnuncios"),
    },
    {
      icon: <LogOut size={24} color="#631C11" />,
      title: "Sair",
      onPress: confirmLogout,
    },
  ];

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil e Configurações</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={option.onPress}
            >
              <View style={styles.optionIcon}>{option.icon}</View>
              <Text style={styles.optionText}>{option.title}</Text>
              <ChevronRight size={20} color="#631C11" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
    marginTop: "24%",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#631C11",
  },
  optionsContainer: {
    backgroundColor: "#F5F3F1",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E4D5D2",
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#631C11",
    fontWeight: "500",
  },
});
