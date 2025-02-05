import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getBook } from "../../services/api/book"; // Importe a função da API
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";

export default function UserAnuncios() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Pega o ID do usuário logado
        if (!userId) {
          throw new Error("Usuário não logado");
        }

        const response = await getBook(); // Busca todos os livros da API

        // Converte userId para número e filtra apenas os livros do usuário logado
        const userBooks = response.books.filter(
          (book) => book.ownerBook === Number(userId)
        );

        setBooks(userBooks); // Atualiza o estado apenas com os livros do usuário
      } catch (error) {
        console.log("Erro ao buscar livros:", error);
        Alert.alert("Erro", "Não foi possível carregar os anúncios.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
        style={styles.container}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#631C11" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Anúncios</Text>
      </View> */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <View>
          <Text style={styles.textbold}>Meus anúncios</Text>
          <Text style={styles.textspan}>Lista de anúncios criados</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {books.length > 0 ? (
          books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookCard}
              onPress={() => navigation.navigate("BookDetails", { book })}
            >
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.nome}</Text>
                <Text style={styles.bookDescription}>{book.description}</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transação:</Text>
                  <Text style={styles.detailValue}>
                    {book.TypeTransaction.name}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Condição:</Text>
                  <Text style={styles.detailValue}>{book.StatusBook.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Gêneros:</Text>
                  <Text style={styles.detailValue}>
                    {book.Generos.map((genero) => genero.name).join(", ")}
                  </Text>
                </View>
              </View>
              {book.imagens &&
              typeof book.imagens === "string" &&
              book.imagens.trim() !== "" ? (
                <Image
                  source={{ uri: book.imagens }}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.bookImagePlaceholder}>
                  <Text style={styles.placeholderText}>Sem imagem</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noBooksText}>
            Você ainda não criou nenhum anúncio.
          </Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#631C11",
    marginLeft: 10,
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  bookInfo: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: "#631C11",
    fontWeight: "500",
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    color: "#777",
  },
  bookImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  bookImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#E4D5D2",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#631C11",
  },
  noBooksText: {
    fontSize: 16,
    color: "#631C11",
    textAlign: "center",
    marginTop: 20,
  },
});
