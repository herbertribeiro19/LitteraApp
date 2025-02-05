import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getBook } from "../../services/api/book";
import { getGenero } from "../../services/api/genero";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Filter } from "lucide-react-native";

export default function SearchBar() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const transactions = ["Venda", "Troca", "Doação"];

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await getBook();
      if (response.books) {
        setBooks(response.books);
        setFilteredBooks(response.books);
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
        setGenres(response.genero.map((genre) => genre.name));
      }
    } catch (error) {
      console.log("Erro ao buscar gêneros:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterBooks(text, selectedGenre, selectedTransaction);
  };

  const handleFilter = (genre, transaction) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
    setSelectedTransaction(
      transaction === selectedTransaction ? null : transaction
    );
    filterBooks(
      searchText,
      genre === selectedGenre ? null : genre,
      transaction === selectedTransaction ? null : transaction
    );
    setIsFilterModalVisible(false);
  };

  const filterBooks = (text, genre, transaction) => {
    let filtered = books;

    if (text) {
      filtered = filtered.filter((book) =>
        book.nome.toLowerCase().includes(text.toLowerCase())
      );
    }
    if (genre) {
      filtered = filtered.filter((book) =>
        book.Generos.some((g) => g.name === genre)
      );
    }
    if (transaction) {
      filtered = filtered.filter(
        (book) => book.TypeTransaction.name === transaction
      );
    }

    setFilteredBooks(filtered);
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.searchBar}>
        <Search size={20} color="#631C11" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar livros..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.filterButtonOpen}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Filter size={20} color="#631C11" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Gênero:</Text>
              <FlatList
                data={genres}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedGenre === item && styles.selectedFilter,
                    ]}
                    onPress={() => handleFilter(item, selectedTransaction)}
                  >
                    <Text style={styles.filterText}>{item}</Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Transação:</Text>
              <FlatList
                data={transactions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedTransaction === item && styles.selectedFilter,
                    ]}
                    onPress={() => handleFilter(selectedGenre, item)}
                  >
                    <Text style={styles.filterText}>{item}</Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <ActivityIndicator size="large" color="#631C11" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookItem}
              onPress={() => navigation.navigate("BookDetails", { book: item })}
            >
              {item.imagens ? (
                <Image
                  source={{ uri: item.imagens }}
                  style={styles.bookImage}
                />
              ) : (
                <View style={styles.bookImagePlaceholder}>
                  <Text style={styles.placeholderText}>Sem imagem</Text>
                </View>
              )}
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.nome}</Text>
                <Text style={styles.bookDetail}>{item.StatusBook.name}</Text>
                <Text style={styles.bookDetail}>
                  {item.TypeTransaction.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginTop: "22%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3F1",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButtonOpen: {
    backgroundColor: "#E4D5D2",
    padding: 8,
    borderRadius: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#F5F3F1",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  filterGroup: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: "#631C11",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: "#1E1F24",
  },
  filterText: {
    color: "#FFFFFF",
  },
  closeModalButton: {
    backgroundColor: "#631C11",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  closeModalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  bookItem: {
    flex: 1,
    margin: 5,
    backgroundColor: "#F5F3F1",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#E4D5D2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  placeholderText: {
    color: "#631C11",
  },
  bookInfo: {
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#631C11",
    textAlign: "center",
    marginBottom: 4,
  },
  bookDetail: {
    fontSize: 14,
    color: "#4F4F4F",
    textAlign: "center",
    marginBottom: 2,
  },
  columnWrapper: {
    justifyContent: "space-between",
    padding: 5,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#631C11",
  },
});
