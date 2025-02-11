import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { PostIA } from "../../services/api/ai";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";

export default function LitterAI() {
  const navigation = useNavigation();
  const [bookData, setBookData] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const logo = require("../../assets/logo_red2.png");

  const logo2 = require("../../assets/IA.png");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await PostIA();
      console.log("Dados recebidos da API:", data);
      setResponseData(data);
    } catch (error) {
      setError("Ocorreu um erro ao tentar recuperar a resposta.");
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <View>
          <Text style={styles.textbold}>LitterAI</Text>
          <Text style={styles.textspan}>
            Inteligência artificial do Littera App
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Esconde a logo quando já tiver dados */}
        {!responseData && <Image style={styles.image} source={logo2} />}
        <Text style={styles.header2}>Bem-vindo(a) ao LitterAI!</Text>
        <Text style={styles.subHeader}>
          Ao clicar no botão abaixo, você receberá recomendações de livros
          baseadas nas suas preferências.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Troca o texto do botão dependendo se há ou não dados */}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>
            {responseData ? "Buscar novas recomendações" : "Buscar Livros"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View>
            <ActivityIndicator
              size="large"
              color="#631C11"
              style={styles.loader}
            />
            <Text style={styles.loaderText}>
              Aguarde, pode demorar um pouco..
            </Text>
          </View>
        )}

        {responseData?.recomendacoes &&
        Array.isArray(responseData.recomendacoes) &&
        responseData.recomendacoes.length > 0 ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Recomendações de Livros</Text>

            {responseData.recomendacoes.map((book, index) => (
              <View key={index} style={styles.bookCard}>
                <Image source={logo2} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.titulo}</Text>
                  <Text style={styles.bookDescription}>{book.descricao}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : responseData && responseData.recomendacoes?.length === 0 ? (
          <Text style={styles.noDataText}>Nenhum livro encontrado.</Text>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: "60%",
  },
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  header2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  btn: {
    width: "90%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#631C11",
    padding: 12,
  },
  btnText: {
    color: "#631C11",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  loaderText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
  responseContainer: {
    marginTop: 20,
    width: "100%",
  },
  responseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 10,
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  bookImage: {
    width: 100,
    height: "auto",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});