import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../services/api/authService";

export default function Register() {
  const navigation = useNavigation();
  const imageBG = require("../../assets/bgImgSignUp.png");
  const logo = require("../../assets/logo.png");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleNameChange = (text) => setName(text);
  const handlePhoneChange = (text) => setPhone(text);
  const handleEmailChange = (text) => setEmail(text);
  const handlePasswordChange = (text) => setPassword(text);
  const handleConfirmPasswordChange = (text) => setConfirmPassword(text);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    try {
      await registerUser(name, email, phone, password);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={imageBG} style={styles.image}>
          <View style={styles.content}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.boxLogin}>
              <Text style={styles.textMain}>Registro</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#f1f1f1"
                value={name}
                onChangeText={handleNameChange}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#f1f1f1"
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType="phone-pad"
                placeholderTextColor="#f1f1f1"
                value={phone}
                onChangeText={handlePhoneChange}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                placeholderTextColor="#f1f1f1"
                value={password}
                onChangeText={handlePasswordChange}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                secureTextEntry
                placeholderTextColor="#f1f1f1"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                <Text style={styles.textBtn}>Registrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn2}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.textBtn2}>Já tenho uma conta</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>
              ® Provided by <Text style={styles.textStrong}>LitteraApp™</Text>
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    margin: 10,
  },
  logo: {
    justifyContent: "center",
    marginTop: "6%",
    alignSelf: "center",
    width: 50,
    height: 80,
  },
  boxLogin: {
    marginVertical: "10%",
    width: "96%",
    alignSelf: "center",
    padding: 4,
    borderRadius: 14,
    justifyContent: "center",
  },
  textMain: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10%",
  },
  input: {
    width: "86%",
    alignSelf: "center",
    borderBottomWidth: 2,
    borderRadius: 6,
    borderBottomColor: "#F5F3F1",
    fontSize: 16,
    padding: 16,
    marginBottom: 10,
    color: "#F5F3F1",
  },
  btn: {
    padding: 14,
    backgroundColor: "#F5F3F1",
    width: "88%",
    marginTop: 10,
    borderRadius: 14,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center",
  },
  textStrong: {
    fontWeight: "bold",
    fontSize: 10,
  },
  btn2: {
    margin: 10,
    padding: 14,
    width: "88%",
    borderColor: "#F5F3F1",
    borderWidth: 0.5,
    borderRadius: 14,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  textBtn: {
    color: "#631C11",
    fontSize: 16,
    fontWeight: "500",
  },
  textBtn2: {
    color: "#F5F3F1",
    fontSize: 16,
    fontWeight: "500",
  },
});
