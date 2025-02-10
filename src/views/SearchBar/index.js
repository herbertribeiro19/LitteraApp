import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getBook } from "../../services/api/book";
import { getGenero } from "../../services/api/genero";
import { getTransactions } from "../../services/api/transactions";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Filter, Sparkles } from "lucide-react-native";

export default function SearchBar() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [maxPrice, setMaxPrice] = useState(100); // Ajuste conforme necessário
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [transaction, setTransaction] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' ou 'desc'

  const IA = require("../../assets/IA.png");
  // const transactions = ["Venda", "Troca", "Doação"];

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      fetchGenres();
      fetchTransactions();
    }, [])
  );

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await getBook();
      if (response.books) {
        const activeBooks = response.books.filter(
          (book) => book.isActive === true
        );
        const sortedBooks = activeBooks.sort((a, b) => b.id - a.id);
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
        setGenres(response.genero.map((genre) => genre.name));
      }
    } catch (error) {
      console.log("Erro ao buscar gêneros:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      if (response) {
        setTransaction(
          response.typeTransaction.map((transaction) => transaction.name)
        );
      }
      console.log("TRANSACOES: ", transaction);
    } catch (error) {
      console.log("Erro ao buscar transactionsType:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterBooks(
      text,
      selectedGenre,
      selectedTransaction,
      selectedCity,
      sortOrder
    );
  };

  const handleFilter = (genre, transaction, city) => {
    const newGenre = selectedGenre === genre ? null : genre;
    setSelectedGenre(newGenre);
    const newTransaction =
      selectedTransaction === transaction ? null : transaction;
    setSelectedTransaction(newTransaction);
    setSelectedCity(city);
    filterBooks(searchText, newGenre, newTransaction, city, sortOrder);
  };

  const handleSortOrder = (order) => {
    setSortOrder(order);
    filterBooks(
      searchText,
      selectedGenre,
      selectedTransaction,
      selectedCity,
      order
    );
  };

  const filterBooks = (text, genre, transaction, city, order) => {
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
    if (city) {
      filtered = filtered.filter((book) =>
        book.cidade.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (order === "asc") {
      filtered = filtered.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (order === "desc") {
      filtered = filtered.sort((a, b) => b.nome.localeCompare(a.nome));
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
        animationType="fade"
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
                    onPress={() =>
                      handleFilter(item, selectedTransaction, selectedCity)
                    }
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
                data={transaction}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedTransaction === item && styles.selectedFilter,
                    ]}
                    onPress={() =>
                      handleFilter(selectedGenre, item, selectedCity)
                    }
                  >
                    <Text style={styles.filterText}>{item}</Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Cidade:</Text>
              <TextInput
                style={styles.cityInput}
                placeholder="Digite a cidade..."
                value={selectedCity}
                onChangeText={(text) => setSelectedCity(text)}
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() =>
                  handleFilter(selectedGenre, selectedTransaction, selectedCity)
                }
              >
                <Text style={styles.filterText}>Filtrar por Cidade</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterOrder}>
              <Text style={styles.filterLabel}>Ordenar por Nome:</Text>
              <TouchableOpacity
                style={[
                  styles.filterButtonOrder,
                  sortOrder === "asc" && styles.selectedFilterOrder,
                ]}
                onPress={() => handleSortOrder("asc")}
              >
                <Text style={styles.filterTextOrder}>A-Z</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButtonOrder,
                  sortOrder === "desc" && styles.selectedFilterOrder,
                ]}
                onPress={() => handleSortOrder("desc")}
              >
                <Text style={styles.filterTextOrder}>Z-A</Text>
              </TouchableOpacity>
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
              onPress={() => navigation.navigate("DetailsBook", { book: item })}
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
                <Text style={styles.bookDetail}>{item.cidade}</Text>
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
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.iaContent}
          onPress={() => navigation.navigate("LitterAI")}
        >
          <Image style={styles.imageIA} source={IA} />
          <Text style={styles.litteraAiText}>Acesse o LitterAI</Text>
          <Sparkles size={16} color="#631C11" style={styles.iconIA} />
        </TouchableOpacity>
      </View>
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
  cityInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
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
  filterOrder: {
    gap: 4,
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
  filterButtonOrder: {
    backgroundColor: "#F5F3F1",
    borderColor: "#631C11",
    borderWidth: 0.6,
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: "#1E1F24",
    margin: 5,
  },
  selectedFilterOrder: {
    backgroundColor: "#ddd",
    margin: 5,
  },
  filterText: {
    color: "#FFFFFF",
  },
  filterTextOrder: {
    color: "#631C11",
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
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
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
  fixedButtonContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    right: 10,
    zIndex: 2,
  },
  iaContent: {
    gap: 0,
    marginBottom: 10,
    flexDirection: "row-reverse",
    backgroundColor: "#E4D5D2",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: 204,
    justifyContent: "space-between",
    alignItems: "center",
  },
  litteraAiText: {
    fontSize: 12,
    marginRight: 8,
    color: "#631C11",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  imageIA: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  iconIA: {
    marginLeft: 8,
  },
});
