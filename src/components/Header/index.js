import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../services/api/users";
import { UserRoundPen, LogOut, LibraryBig, Bell } from "lucide-react-native";
import { getNotification } from "../../services/api/notification";

export default function Header() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const logoMale = require("../../assets/iconuserM.png");
  const logoFemale = require("../../assets/iconuserF.png");

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      fetchNotifications();
    }, [])
  );

  const isFemale = (name) => {
    return name.toLowerCase().endsWith("a");
  };

  const handleLogout = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.log("Erro: Nenhum usuário logado.");
        return;
      }
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
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

  const handlePreferencies = () => {
    setModalVisible(false);
    navigation.navigate("Preferencies");
  };

  const handleEditUser = () => {
    setModalVisible(false);
    navigation.navigate("EditUser");
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const userData = await getUser(token);
      if (userData?.user?.name) {
        const firstName = userData.user.name.split(" ")[0];
        setUserName(firstName);
      } else {
        throw new Error("Nome do usuário não encontrado");
      }
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notifications = await getNotification();
      setNotificationCount(notifications.notifications.length); // Atualiza o contador
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
    }
  };

  const handleNotificationPress = () => {
    setNotificationCount(0); // Zera o contador
    navigation.navigate("Notification"); // Navega para a página de notificações
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonCircle}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={isFemale(userName) ? logoFemale : logoMale}
          style={styles.logo}
        />
      </TouchableOpacity>
      <Text style={styles.name}>
        Olá, <Text style={styles.nameuser}>{userName || "Usuário"}</Text>
      </Text>

      {/* Ícone de Notificações */}
      <TouchableOpacity
        style={styles.notificationIcon}
        onPress={handleNotificationPress}
      >
        <Bell size={24} color="#631C11" />
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* MODAL DE OPÇÕES */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleEditUser}
            >
              <UserRoundPen size={18} color="#631C11" />
              <Text style={styles.modalText}>Editar Usuário</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePreferencies}
            >
              <LibraryBig size={18} color="#631C11" />
              <Text style={styles.modalText}>Preferências</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={confirmLogout}
            >
              <LogOut size={18} color="red" />
              <Text style={[styles.modalText, { color: "red" }]}>
                Fazer Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginTop: "14%",
    width: "100%",
    height: "11%",
    gap: 8,
    alignItems: "center",
    padding: 12,
    flexDirection: "row",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  name: {
    fontSize: 18,
    color: "#631C11",
  },
  nameuser: {
    fontSize: 18,
    color: "#631C11",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 250,
    backgroundColor: "#F5F3F1",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  modalOption: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
    padding: 12,
    justifyContent: "center",
  },
  modalCancel: {
    width: "100%",
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#631C11",
  },
  notificationIcon: {
    marginLeft: "auto",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#631C11",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
