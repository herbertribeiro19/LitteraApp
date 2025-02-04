import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkle,
  Wand,
  BookHeart,
  Church,
  Baby,
  Ghost,
  DoorClosed,
} from "lucide-react-native";
import BannerCarousel from "../../components/Banners";
import { getBook } from "../../services/api/book";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const list = [
    { id: "1", category: "Fantasia", icon: <Wand size={20} color="#F5F3F1" /> },
    {
      id: "2",
      category: "Ficção",
      icon: <Sparkle size={20} color="#F5F3F1" />,
    },
    {
      id: "3",
      category: "Romance",
      icon: <BookHeart size={20} color="#F5F3F1" />,
    },
    {
      id: "4",
      category: "Religioso",
      icon: <Church size={20} color="#F5F3F1" />,
    },
    { id: "5", category: "Infantil", icon: <Baby size={20} color="#F5F3F1" /> },
    {
      id: "6",
      category: "Suspense",
      icon: <DoorClosed size={20} color="#F5F3F1" />,
    },
    { id: "7", category: "Terror", icon: <Ghost size={20} color="#F5F3F1" /> },
  ];

  // Função para buscar os livros e ordená-los do mais recente para o mais antigo
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await getBook();

      if (response.books) {
        // Ordena os livros do mais recente para o mais antigo
        const sortedBooks = response.books.sort((a, b) => b.id - a.id);
        setBooks(sortedBooks);
      }
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      Alert.alert("Erro", "Não foi possível carregar os livros.");
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza automaticamente quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  // Função de refresh ao puxar para baixo
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const renderBookItem = ({ item }) => {
    const hasImage = item.imagens && item.imagens.trim() !== "";

    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => navigation.navigate("BookDetails", { book: item })}
      >
        {hasImage ? (
          <Image source={{ uri: item.imagens }} style={styles.bookImage} />
        ) : (
          <View style={styles.bookImagePlaceholder}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.nome}</Text>
          <Text style={styles.bookDetailBold}>{item.StatusBook.name}</Text>
          <Text style={styles.bookDetail}>
            Disponível para{" "}
            <Text style={styles.bookDetailBold}>
              {item.TypeTransaction.name}
            </Text>
          </Text>

          <Text style={styles.bookDetail}>
            <Text style={styles.generoBadge}>
              {item.Generos.map((genero) => genero.name).join(", ")}
            </Text>
          </Text>
          {item.value && (
            <Text style={styles.bookValue}>R$ {item.value},00</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <Header />

      <FlatList
        ListHeaderComponent={
          <>
            <View>
              <BannerCarousel />
            </View>

            <Text style={styles.h1}>Gêneros</Text>
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                data={list}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item}>
                    {item.icon}
                    <Text style={styles.textCategorias}>{item.category}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

            <Text style={styles.h1}>Livros</Text>
          </>
        }
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              size="large"
              color="#631C11"
              style={styles.loader}
            />
          ) : (
            <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
          )
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
  content: {
    paddingTop: "4%",
    paddingBottom: "20%",
  },
  h1: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 20,
    color: "#631C11",
  },
  list: {
    marginLeft: 10,
    paddingBottom: 10,
  },
  item: {
    backgroundColor: "#631C11",
    flexDirection: "column",
    alignItems: "center",
    marginRight: 15,
    minWidth: 90,
    gap: 4,
    padding: 14,
    borderRadius: 14,
  },
  textCategorias: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  bookItem: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  bookImagePlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#E4D5D2",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#631C11",
    fontSize: 12,
    textAlign: "center",
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 5,
  },
  bookValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#631C11",
  },
  bookDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  bookDetail: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  bookDetailBold: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#631C11",
  },
});
