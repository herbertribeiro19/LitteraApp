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
  TextInput,
} from "react-native";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import BannerCarousel from "../../components/Banners";
import { getBook } from "../../services/api/book";
import { getGenero } from "../../services/api/genero";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await getBook();
      if (response.books) {
        const sortedBooks = response.books.sort((a, b) => b.id - a.id);
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks);
      }
    } catch (error) {
      console.log("Erro ao buscar livros:", error);
      Alert.alert("Erro", "Não foi possível carregar os livros.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await getGenero();
      if (response) {
        const formattedGenres = response.genero.map((g) => ({
          id: g.id,
          name: g.name,
          icon: g.icon, // Confirma que cada item tem o campo 'icon'
        }));

        setGenres([{ id: 0, name: "Todos", icon: "book" }, ...formattedGenres]);
      }
    } catch (error) {
      console.log("Erro ao buscar gêneros:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      fetchGenres();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      setFilteredBooks(
        books.filter((book) =>
          book.nome.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredBooks(books);
    }
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    if (genre.id === 0) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter((book) => book.Generos.some((g) => g.name === genre.name))
      );
    }
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
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar livros..."
              value={searchTerm}
              onChangeText={handleSearch}
            />
            <View>
              <BannerCarousel />
            </View>

            <Text style={styles.h1}>Gêneros</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.list}
              data={genres}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      selectedGenre?.id === item.id && styles.selectedGenre, // Estilo alterado para o item selecionado
                    ]}
                    onPress={() => handleGenreSelect(item)}
                  >
                    <Ionicons
                      name={item.icon || "book"} // Ícone padrão caso não tenha
                      size={24}
                      color={
                        selectedGenre?.id === item.id ? "#fff" : "#fff" // Ícone branco se selecionado, senão a cor original
                      }
                    />
                    <Text style={styles.textCategorias}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
            />

            <View style={styles.livrosSection}>
              <View>
                <Text style={styles.h1}>Livros</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SearchBar")}
                >
                  <Text style={styles.seeMore}>Ver mais</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        data={filteredBooks}
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
  searchInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    margin: 10,
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
  selectedGenre: {
    backgroundColor: "#1E1F24",
  },
  textCategorias: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  bookItem: {
    backgroundColor: "#F5F3F1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 12,
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
  livrosSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  seeMore: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    marginRight: 10,
    marginTop: 20,
    color: "#777",
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
    fontSize: 14,
    fontWeight: "600",
    color: "#631C11",
  },
  bookDetail: {
    fontSize: 12,
    color: "#4F4F4F",
    marginBottom: 5,
  },
  bookDetailBold: {
    fontSize: 12,
    color: "#1E1F24",
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
