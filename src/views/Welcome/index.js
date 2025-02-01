import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation();
  const logo = require("../../assets/_476871824.png");

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.boxmain}>
        <Image source={logo} style={styles.logo} />
        <View>
          <Text style={styles.textmin}>Olá,</Text>
          <Text style={styles.textbold}>Bem vindo(a) ao LitteraApp™</Text>
          <Text style={styles.textspan}>
            Livros para todos, histórias para sempre!
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.btnRegister}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.textbtnregister}>Criar um registro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnlogin}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.textbtnlogin}>Já tenho registro</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3F1",
    flexDirection: "column",
  },
  boxmain: {
    marginVertical: "30%",
    marginHorizontal: "6%",
    justifyContent: "center",
    flexDirection: "column",
    alignSelf: "center",
    gap: "10%",
  },
  logo: {
    justifyContent: "center",
    alignSelf: "center",
    width: 110 * 1.3,
    height: 126 * 1.3,
  },
  textmin: {
    color: "#631C11",
    fontSize: 30,
    fontWeight: "200",
  },
  textbold: {
    color: "#631C11",
    fontSize: 26,
    fontWeight: "600",
  },
  textspan: {
    color: "#631C11",
    marginTop: "14%",
    fontSize: 18,
    fontWeight: "300",
  },
  btnRegister: {
    backgroundColor: "#631C11",
    width: "86%",
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
    width: "85.5%",
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
});
