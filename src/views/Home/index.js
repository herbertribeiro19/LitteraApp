import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
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
// import env from "../../../.env";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const list = [
    {
      id: "1",
      category: "Fantasia",
      icon: <Wand size={24} color="#fff" />,
    },
    {
      id: "2",
      category: "Ficção",
      icon: <Sparkle size={24} color="#fff" />,
    },
    {
      id: "3",
      category: "Romance",
      icon: <BookHeart size={24} color="#fff" />,
    },
    {
      id: "4",
      category: "Religioso",
      icon: <Church size={24} color="#fff" />,
    },
    {
      id: "5",
      category: "Infantil",
      icon: <Baby size={24} color="#fff" />,
    },
    {
      id: "6",
      category: "Suspense",
      icon: <DoorClosed size={24} color="#fff" />,
    },
    {
      id: "7",
      category: "Terror",
      icon: <Ghost size={24} color="#fff" />,
    },
  ];

  // Função para buscar livros com base na entrada
  //   const fetchBooks = async () => {
  //     setIsLoading(true); // Inicia o carregamento
  //     try {
  //       const response = await axios.get(GOOGLE_BOOKS_API_URL, {
  //         params: {
  //           q: search,
  //           key: API_KEY,
  //         },
  //       });
  //       setBooks(response.data.items || []);
  //     } catch (error) {
  //       console.error("Erro ao buscar livros: ", error);
  //       setBooks([]);
  //     } finally {
  //       setIsLoading(false); // Finaliza o carregamento
  //     }
  //   };

  //   // useEffect para chamada inicial da API ao carregar o componente
  //   useEffect(() => {
  //     fetchBooks();
  //   }, []);

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <Header />
      <View style={styles.content}>
        <Text style={styles.h1}>Categorias</Text>
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
            keyExtractor={(item) => item.id} // Usando o id como chave para garantir unicidade
          />
        </View>

        {/* <TextInput
          style={styles.searchInput}
          placeholder="Pesquise livro"
          value={search}
          placeholderTextColor={"#631C11"}
          onChangeText={(text) => setSearch(text)}
          //   onSubmitEditing={fetchBooks}
        /> */}
        {/* <Text style={styles.h1}>Livros</Text> */}

        {/* {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#631C11"
            style={styles.loader}
          />
        ) : (
          <FlatList
            style={styles.list}
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookItem}>
                {item.volumeInfo.imageLinks?.thumbnail && (
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    style={styles.thumbnail}
                  />
                )}
                <View style={styles.bookInfo}>
                  <Text style={styles.title}>{item.volumeInfo.title}</Text>
                  <Text>{item.volumeInfo.authors?.join(", ")}</Text>
                  <Text>{item.volumeInfo.publishedDate}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text>Nenhum livro encontrado.</Text>}
          />
        )} */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 6,
    width: "100%",
    backgroundColor: "red",
    height: "100%",
  },
  content: {
    flex: 1,
    gap: 20,
  },
  h1: {
    fontSize: 24,
    fontWeight: "500",
    marginLeft: 10,
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
    gap: 6,
    padding: 18,
    borderRadius: 14,
  },
  textCategorias: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },

  //   list: {
  //     marginTop: -20,
  //   },
  //   searchInput: {
  //     height: "8%",
  //     width: "96%",
  //     borderRadius: 30,
  //     padding: 18,
  //     borderWidth: 0.5,
  //     backgroundColor: "#f1f1f1",
  //     borderColor: "#631C11",
  //     color: "#631C11",
  //     alignSelf: "center",
  //     fontSize: 16,
  //   },
  //   bookItem: {
  //     flexDirection: "row",
  //     alignItems: "center",
  //     padding: 4,
  //     backgroundColor: "#f9f9f9",
  //     borderRadius: 10,
  //     margin: 4,
  //   },
  //   thumbnail: {
  //     width: 90,
  //     height: 120,
  //     marginRight: 10,
  //   },
  //   bookInfo: {
  //     flex: 1,
  //   },
  //   title: {
  //     fontWeight: "bold",
  //     fontSize: 18,
  //   },
  //   loader: {
  //     marginTop: 20,
  //     alignSelf: "center",
  //   },
});
