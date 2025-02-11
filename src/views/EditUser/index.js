import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, editUser } from "../../services/api/users";
import { ChevronLeft } from "lucide-react-native";
import { MaskedTextInput } from "react-native-mask-text";

const countryList = [
  { name: "Brasil", code: "55", flag: "🇧🇷" },
  { name: "Estados Unidos", code: "1", flag: "🇺🇸" },
  { name: "Portugal", code: "351", flag: "🇵🇹" },
  { name: "Argentina", code: "54", flag: "🇦🇷" },
];

export default function EditUser() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("55");
  const [countryFlag, setCountryFlag] = useState("🇧🇷");
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const userData = await getUser(token);

      if (userData?.user) {
        setName(userData.user.name || "");
        setNickname(userData.user.nickname || "");
        setEmail(userData.user.email || "");
        setPhone(userData.user.phone || "");
      }
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const formattedPhone = `${countryCode}${phone.replace(/\D/g, "")}`;

    try {
      await editUser(name, nickname, email, formattedPhone);
      Alert.alert("Sucesso", "Dados do usuário atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Erro ao atualizar",
        "Verifique os dados do usuário e tente novamente."
      );
    }
  };

  const onSelectCountry = (country) => {
    setCountryCode(country.code);
    setCountryFlag(country.flag);
    setIsCountryModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <View>
          <Text style={styles.textbold}>Editar usuário</Text>
          <Text style={styles.textspan}>
            Edite as informações desejadas e salve quando finalizar
          </Text>
        </View>
      </View>
      <View style={styles.boxLogin}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Nome social (Apelido)"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        {/* <MaskedTextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          mask="(99) 99999-9999"
          keyboardType="phone-pad"
          placeholder="Telefone"
        /> */}
        <View style={styles.phoneContainer}>
          <View style={styles.left}>
            <TouchableOpacity
              style={styles.countryPickerButton}
              onPress={() => setIsCountryModalVisible(true)}
            >
              <Text style={styles.countryFlag}>{countryFlag}</Text>
            </TouchableOpacity>
            <Text style={styles.countryCode}>+{countryCode}</Text>
          </View>
          <View style={styles.right}>
            <MaskedTextInput
              style={styles.phoneInput}
              placeholder="Telefone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text, rawText) => setPhone(rawText)}
              mask="(99) 99999-9999"
            />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.btnRegister} onPress={handleUpdateUser}>
          <Text style={styles.textbtnregister}>Salvar alterações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnlogin}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textbtnlogin}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      {/* Modal de seleção de país */}
      <Modal visible={isCountryModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={countryList}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => onSelectCountry(item)}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryName}>
                    {item.name} (+{item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIsCountryModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: "24%",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  textbold: {
    color: "#631C11",
    fontSize: 26,
    fontWeight: "600",
  },
  textspan: {
    color: "#631C11",
    marginTop: "1%",
    fontSize: 12,
    fontWeight: "300",
  },
  btnRegister: {
    backgroundColor: "#631C11",
    width: "87%",
    alignSelf: "center",
    marginHorizontal: "6%",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  textbtnregister: {
    color: "#F5F3F1",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  btnlogin: {
    backgroundColor: "#F5F3F1",
    borderColor: "#631C11",
    borderWidth: 0.5,
    width: "86.5%",
    alignSelf: "center",
    marginHorizontal: "6%",
    padding: 14,
    borderRadius: 14,
  },
  textbtnlogin: {
    color: "#631C11",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  input: {
    width: "86%",
    alignSelf: "center",
    borderBottomWidth: 2,
    borderRadius: 6,
    borderBottomColor: "#631C11",
    fontSize: 16,
    padding: 16,
    marginBottom: 10,
    color: "#631C11",
  },
  content: {
    marginTop: 50,
  },

  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "86%",
    alignSelf: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderRadius: 6,
    borderBottomColor: "#631C11",
    marginBottom: 10,
  },
  right: {
    flexDirection: "row",
    width: "70%",
  },
  left: {
    flexDirection: "row",
    width: "20%",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    color: "#631C11",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryName: {
    fontSize: 18,
  },
  modalClose: {
    marginTop: 10,
    alignSelf: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "red",
  },
  countryPickerButton: {
    marginRight: 10,
  },
  countryCode: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#631C11",
  },
  countryFlag: {
    alignSelf: "left",
    fontSize: 24,
    color: "#fff",
  },
});
