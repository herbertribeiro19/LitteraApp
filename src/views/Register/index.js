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
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../services/api/authService";
import { Eye, EyeOff, Globe } from "lucide-react-native"; // Adicionei o ícone Globe
import { MaskedTextInput } from "react-native-mask-text";

const countryList = [
  { name: "Brasil", code: "55", flag: "🇧🇷" },
  { name: "Estados Unidos", code: "1", flag: "🇺🇸" },
  { name: "Portugal", code: "351", flag: "🇵🇹" },
  { name: "Argentina", code: "54", flag: "🇦🇷" },
];

export default function Register() {
  const navigation = useNavigation();
  const imageBG = require("../../assets/bgImg.png");
  const logo = require("../../assets/logo.png");

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("55");
  const [countryFlag, setCountryFlag] = useState("🇧🇷");
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

  // Estado para alternar visibilidade da senha
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreateUser = async () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    // Formata o telefone com o código do país e remove caracteres não numéricos
    const formattedPhone = `${countryCode}${phone.replace(/\D/g, "")}`;

    try {
      await registerUser(name, nickname, email, password, formattedPhone);
      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Erro ao criar novo registro",
        "Verifique as informações e tente novamente."
      );
    }
  };

  const onSelectCountry = (country) => {
    setCountryCode(country.code);
    setCountryFlag(country.flag);
    setIsCountryModalVisible(false);
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
                onChangeText={setName}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Nome social (Apelido)"
                placeholderTextColor="#f1f1f1"
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#f1f1f1"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

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

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Senha"
                  placeholderTextColor="#f1f1f1"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {isPasswordVisible ? (
                      <EyeOff size={24} color="#F5F3F1" />
                    ) : (
                      <Eye size={24} color="#F5F3F1" />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#f1f1f1"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirmPassword ? (
                      <EyeOff size={24} color="#F5F3F1" />
                    ) : (
                      <Eye size={24} color="#F5F3F1" />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btn} onPress={handleCreateUser}>
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
        {/* Modal de seleção de país */}
        <Modal
          visible={isCountryModalVisible}
          animationType="slide"
          transparent
        >
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "86%",
    alignSelf: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderRadius: 6,
    borderBottomColor: "#F5F3F1",
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
    color: "#F5F3F1",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "86%",
    alignSelf: "center",
    borderBottomWidth: 2,
    borderRadius: 6,
    borderBottomColor: "#F5F3F1",
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    color: "#F5F3F1",
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 18,
    color: "#f1f1f1",
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
    color: "#fff",
  },
  countryFlag: {
    alignSelf: "left",
    fontSize: 24,
    color: "#fff",
  },
});
