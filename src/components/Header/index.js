import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../services/api/users";
import { UserRoundPen, LogOut } from "lucide-react-native";

export default function Header() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Estado para abrir/fechar o modal

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isLoggedIn");

    // Executa a navegação dentro de um `requestAnimationFrame` para garantir que o Alert seja fechado antes
    requestAnimationFrame(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
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

  const handleEditUser = () => {
    setModalVisible(false);
    navigation.navigate("EditUser");
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const userData = await getUser(token);
      console.log("Resposta do getUser:", userData);

      if (userData?.user?.name) {
        const firstName = userData.user.name.split(" ")[0];
        setUserName(firstName);
      } else {
        throw new Error("Nome do usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonCircle}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="user" size={26} color="#631C11" />
      </TouchableOpacity>
      <Text style={styles.name}>
        Olá, <Text style={styles.nameuser}>{userName || "Usuário"}</Text>
      </Text>

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
    width: "96%",
    height: "10%",
    gap: 8,
    alignItems: "center",
    padding: 12,
    flexDirection: "row",
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
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: "#E4D5D2",
    borderRadius: 40,
    borderColor: "#631C11",
    borderWidth: 0.2,
    justifyContent: "center",
    alignItems: "center",
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
});
