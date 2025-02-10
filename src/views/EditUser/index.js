import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../../services/api/users";
import { editUser } from "../../services/api/users";
import { ChevronLeft } from "lucide-react-native";

export default function EditUser() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

    try {
      await editUser(name, nickname, email, phone);
      Alert.alert("Sucesso", "Dados do usuário atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Erro ao atualizar",
        "Verifique os dados do usuário e tente novamente."
      );
    }
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
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Telefone"
          keyboardType="phone-pad"
        />
        {/* <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Nova Senha"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={24} color="#631C11" />
            ) : (
              <Eye size={24} color="#631C11" />
            )}
          </TouchableOpacity>
        </View> */}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: "#F5F3F1",
  //     flexDirection: "column",
  //   },
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "86%",
    alignSelf: "center",
    borderBottomWidth: 2,
    borderRadius: 6,
    borderBottomColor: "#631C11",
    marginBottom: 10,
  },
  content: {
    marginTop: 50,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    color: "#631C11",
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 18,
    color: "#631C11",
  },
});
