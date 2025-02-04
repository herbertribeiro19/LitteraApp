import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getBookId } from "../../services/api/book";
import { postInteresse } from "../../services/api/book";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import {
  BookA,
  BookType,
  BookUser,
  ChevronLeft,
  Share2,
} from "lucide-react-native";
import Swiper from "react-native-swiper";
import ImageView from "react-native-image-viewing"; // Importe a biblioteca

const { width } = Dimensions.get("window");

export default function BookDetails({ route }) {
  const { book } = route.params;
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [hasInteresse, setHasInteresse] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const [imageIndex, setImageIndex] = useState(0); // Índice da imagem selecionada

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

  const handleInteresse = async () => {
    try {
      const payload = { bookId: book.id };
      await postInteresse(payload);
      setHasInteresse(!hasInteresse);
      Alert.alert(
        "Sucesso",
        hasInteresse
          ? "Interesse removido com sucesso!"
          : "Interesse registrado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao demonstrar interesse:", error);
      Alert.alert("Erro", "Não foi possível processar sua solicitação.");
    }
  };

  const handleShare = async () => {
    try {
      const bookUrl = Linking.createURL(`/book/${book.id}`);
      const message = `${book.nome}\n${book.description}\nAcesse: ${bookUrl}`;
      await Share.share({ message });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["transparent", "transparent"],
    extrapolate: "clamp",
  });

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date
      .toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", " às"); // Substitui a vírgula por " às"
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <Animated.View
        style={[styles.header, { backgroundColor: headerBackgroundColor }]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color="#F5F3F1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 size={22} color="#F5F3F1" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#631C11"
            style={styles.loader}
          />
        ) : imagens.length > 0 ? (
          <Swiper
            style={styles.swiper}
            showsPagination={true}
            dotColor="#E4D5D2"
            activeDotColor="#631C11"
          >
            {imagens.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setImageIndex(index); // Define o índice da imagem clicada
                  setVisible(true); // Abre o modal
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        ) : (
          <View style={styles.bookImagePlaceholder}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.contentDetails01}>
          <Text style={styles.bookTitle}>{book.nome}</Text>
          {book.value && (
            <Text style={styles.detailBookValor}>R$ {book.value}</Text>
          )}
          <Text style={styles.detailDatePosted}>
            Livro publicado em: {formatDate(book.createdAt)}
          </Text>
        </View>

        <View style={styles.contentDetails02}>
          <View style={styles.bookDetails}>
            <Text style={styles.Details}>Descrição do Livro</Text>
            <Text style={styles.bookDescription}>{book.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.Details}>Detalhes do Livro</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Disponível para:</Text>
              <Text style={styles.detailValue}>
                {book.TypeTransaction.name}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Condição:</Text>
              <Text style={styles.detailValue}>{book.StatusBook.name}</Text>
            </View>
            <View style={styles.detailColumn}>
              <View style={styles.detailRow}>
                <BookType size={24} marginTop={4} color={"#631C11"} />
                <Text style={styles.generoslist}>
                  {book.Generos.map((genero) => genero.name).join(", ")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo no bottom */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[
            styles.interestButton,
            hasInteresse && styles.removeInterestButton,
          ]}
          onPress={handleInteresse}
        >
          <Text style={styles.interestButtonText}>
            {hasInteresse ? "Remover Interesse" : "Demonstrar Interesse"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Visualização de Imagens */}
      <ImageView
        images={imagens.map((uri) => ({ uri }))} // Converte as URIs para o formato esperado
        imageIndex={imageIndex} // Índice da imagem atual
        visible={visible} // Controla a visibilidade do modal
        onRequestClose={() => setVisible(false)} // Fecha o modal
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100, // Espaço extra para o botão fixo
  },
  swiper: {
    height: 480,
  },
  bookImage: {
    width: "100%",
    height: 466,
    resizeMode: "cover",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bookImagePlaceholder: {
    width: "100%",
    height: 480,
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
  contentDetails01: {
    paddingHorizontal: 20,
    paddingTop: "3%",
  },
  contentDetails02: {
    paddingHorizontal: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
  bookDetails: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 10,
  },
  Details: {
    fontSize: 20,
    color: "#631C11",
    fontWeight: "500",
    marginBottom: 20,
    lineHeight: 24,
  },
  bookDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    lineHeight: 24,
  },
  removeInterestButton: {
    backgroundColor: "#1E1F24",
  },
  detailRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: "#631C11",
    fontWeight: "500",
  },
  detailColumn: {
    flex: 1,
    flexDirection: "column",
    gap: 6,
  },
  generoslist: {
    marginTop: 5,
    fontSize: 16,
    color: "#777",
    flexShrink: 1,
    textAlign: "left",
  },
  detailValue: {
    fontSize: 16,
    color: "#777",
    flexShrink: 1,
    marginLeft: 10,
    textAlign: "left",
  },
  detailBookValor: {
    fontSize: 20,
    color: "#631C11",
    fontWeight: "400",
  },
  detailDatePosted: {
    fontSize: 12,
    marginTop: 10,
    color: "#555",
    fontWeight: "400",
  },
  interestButton: {
    backgroundColor: "#631C11",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  interestButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    backgroundColor: "#631C11",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fixedButtonContainer: {
    position: "absolute",
    marginBottom: 18,
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2, // Garante que o botão fique acima de todo o conteúdo
  },
});
