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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  desactivateBook,
  activateBook,
  getBookId,
  deleteBookId,
} from "../../services/api/book";
import {
  postInteresse,
  getInteresse,
  getInteressadosBook,
} from "../../services/api/interesse";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import {
  BookType,
  ChevronLeft,
  Share2,
  MoreVertical,
  MapPinned,
} from "lucide-react-native";
import Swiper from "react-native-swiper";
import ImageView from "react-native-image-viewing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InteressadosList from "../../components/InteressadosList";

const { width } = Dimensions.get("window");

export default function DetailsBook({ route }) {
  const { book } = route.params;
  const { bookId } = route.params;
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [hasInteresse, setHasInteresse] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [interessados, setInteressados] = useState([]);
  const [isActive, setIsActive] = useState(book.isActive);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error("Token ou ID do usuário não encontrado");
        }

        // Verifica se o usuário atual é o dono do livro
        if (book.ownerBook === parseInt(userId)) {
          setIsOwner(true);

          // Busca os interessados no livro
          const interessadosData = await getInteressadosBook(book.id);
          console.log(
            "Dados dos interessados:",
            JSON.stringify(interessadosData, null, 2)
          ); // Para depuração
          setInteressados(interessadosData.book.interessados); // Atualiza o estado com os interessados
        }

        // Busca os detalhes do livro
        const bookData = await getBookId(book.id);
        setImagens(bookData.book.imagens || []);
        setIsActive(bookData.book.isActive); // Atualiza o estado isActive do livro

        // Verifica se o usuário atual tem interesse no livro
        const interesse = await getInteresse(book.id);
        setHasInteresse(interesse);
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      console.log("Erro ao demonstrar interesse:", error);
      Alert.alert("Erro", "Não foi possível processar sua solicitação.");
    }
  };

  const handleShare = async () => {
    try {
      const bookUrl = Linking.createURL(`/book/${book.id}`);
      const message = `${book.nome}\n${book.description}\nAcesse: ${bookUrl}`;
      await Share.share({ message });
    } catch (error) {
      console.log("Erro ao compartilhar:", error);
    }
  };

  const handleOptionsPress = () => {
    setShowOptionsModal(true);
  };

  const handleUpdateBook = () => {
    setShowOptionsModal(false);
    // Passando os dados do livro para a página de edição
    navigation.navigate("EditBook", { book: book });
  };

  const handleDeleteBook = async () => {
    setShowOptionsModal(false);
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja deletar este livro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              // Implemente a função para deletar o livro
              await deleteBookId(book.id);
              Alert.alert("Sucesso", "Livro deletado com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.log("Erro ao deletar livro:", error);
              Alert.alert("Erro", "Não foi possível deletar o livro.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDesactivateBook = async () => {
    setShowOptionsModal(false);
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja desativar este anúncio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desativar",
          onPress: async () => {
            try {
              await desactivateBook(book.id);
              setIsActive(false);
              Alert.alert("Sucesso", "Anúncio desativado com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.log("Erro ao desativar anúncio:", error);
              Alert.alert("Erro", "Não foi possível desativar o anúncio.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleActivateBook = async () => {
    setShowOptionsModal(false);
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja ativar este anúncio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ativar",
          onPress: async () => {
            try {
              await activateBook(book.id);
              setIsActive(true);
              Alert.alert("Sucesso", "Anúncio ativado com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.log("Erro ao ativar anúncio:", error);
              Alert.alert("Erro", "Não foi possível ativar o anúncio.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

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
      .replace(",", " às");
  };

  const handlePressInteressado = (interessado) => {
    const normalizedInteressado = {
      name: interessado.user.name,
      email: interessado.user.email,
      phone: interessado.user.phone,
    };
    navigation.navigate("InteressadoDetails", {
      interessado: normalizedInteressado,
    });
  };
  if (!book || loading) {
    return <ActivityIndicator size="large" color="#631C11" />;
  }

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: ["transparent", "transparent"],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color="#F5F3F1" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={22} color="#F5F3F1" />
          </TouchableOpacity>
          {isOwner && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleOptionsPress}
            >
              <MoreVertical size={22} color="#F5F3F1" />
            </TouchableOpacity>
          )}
        </View>
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
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#631C11" />
          </View>
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
                  setImageIndex(index);
                  setVisible(true);
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
          <View style={styles.detailColumn}>
            <View style={styles.detailRow}>
              <MapPinned size={18} marginTop={4} color={"#631C11"} />
              <Text style={styles.cidadeText}>{book.cidade}</Text>
            </View>
          </View>
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

          {isOwner &&
            interessados.length > 0 &&
            (console.log("Interessados:", interessados), // Verifique se os dados estão corretos
            (
              <View style={styles.bookDetails}>
                <InteressadosList
                  interessados={interessados}
                  onPressInteressado={handlePressInteressado}
                />
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Botão fixo no bottom */}
      {!isOwner && (
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
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleUpdateBook}
            >
              <Text style={styles.modalText}>Atualizar Livro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeleteBook}
            >
              <Text style={styles.modalText}>Deletar Livro</Text>
            </TouchableOpacity>
            {isActive ? (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDesactivateBook}
              >
                <Text style={styles.modalText}>Desativar Anúncio</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleActivateBook}
              >
                <Text style={styles.modalText}>Ativar Anúncio</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.modalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Visualização de Imagens */}
      <ImageView
        images={imagens.map((uri) => ({ uri }))}
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 200,
  },
  content: {
    paddingBottom: 100,
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
  cidadeText: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
    flexShrink: 1,
    textAlign: "left",
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
    marginBottom: 10,
  },
  detailDatePosted: {
    fontSize: 12,
    marginTop: 4,
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
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  fixedButtonContainer: {
    position: "absolute",
    marginBottom: 18,
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2,
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
    padding: 12,
    alignItems: "center",
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
  interessadoContainer: {
    marginBottom: 10,
  },
  interessadoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#631C11",
  },
  interessadoInfo: {
    fontSize: 14,
    color: "#555",
  },
});
