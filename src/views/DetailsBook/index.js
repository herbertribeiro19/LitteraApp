import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Share,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getBookId } from "../../services/api/book";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native"; // Importe o useNavigation

export default function BookDetails({ route }) {
  const { book } = route.params;
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Use o hook de navegação

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const bookData = await getBookId(book.id);
        setImagens(bookData.book.imagens || []);
      } catch (error) {
        console.error("Erro ao carregar imagens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [book.id]);

  const handleShare = async () => {
    try {
      const bookUrl = Linking.createURL(`/book/${book.id}`);
      const message = `${book.nome}\n${book.description}\nAcesse: ${bookUrl}`;
      await Share.share({ message });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#631C11"
            style={styles.loader}
          />
        ) : imagens.length > 0 ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={imagens}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.bookImage} />
            )}
            contentContainerStyle={styles.imageCarousel}
          />
        ) : (
          <View style={styles.bookImagePlaceholder}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{book.nome}</Text>
          <Text style={styles.bookDescription}>{book.description}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transação:</Text>
            <Text style={styles.detailValue}>{book.TypeTransaction.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{book.StatusBook.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gêneros:</Text>
            <Text style={styles.detailValue}>
              {book.Generos.map((genero) => genero.name).join(", ")}
            </Text>
          </View>
          {book.value && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor:</Text>
              <Text style={styles.detailValue}>R$ {book.value}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>Demonstrar Interesse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: {
    paddingBottom: 40,
  },
  imageCarousel: {
    marginBottom: 20,
  },
  bookImage: {
    width: 350,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginRight: 15,
  },
  bookImagePlaceholder: {
    width: "100%",
    height: 400,
    borderRadius: 15,
    backgroundColor: "#E4D5D2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    color: "#631C11",
    fontSize: 16,
    fontWeight: "500",
  },
  bookDetails: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 10,
  },
  bookDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: "#631C11",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: "#777",
    flexShrink: 1,
    marginLeft: 10,
    textAlign: "right",
  },
  interestButton: {
    backgroundColor: "#631C11",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  interestButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#008CBA",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  shareButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    marginTop: "12%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#631C11",
    fontWeight: "bold",
  },
});
