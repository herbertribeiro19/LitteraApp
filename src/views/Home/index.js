// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Image,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import Header from "../../components/Header";
// import axios from "axios";
// import env from "../../../.env";

// const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
// const API_KEY = env.GOOGLE_BOOKS_API_URL;

// export default function Home() {
//   const [books, setBooks] = useState([]);
//   const [search, setSearch] = useState("all");
//   const [isLoading, setIsLoading] = useState(false);

//   // Função para buscar livros com base na entrada
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

//   return (
//     <View style={styles.container}>
//       <Header />
//       <View style={styles.content}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Pesquise livro"
//           value={search}
//           placeholderTextColor={"#631C11"}
//           onChangeText={(text) => setSearch(text)}
//           onSubmitEditing={fetchBooks} // Chama a busca ao confirmar
//         />
//         <Text style={styles.h1}>Livros</Text>

//         {isLoading ? (
//           <ActivityIndicator
//             size="large"
//             color="#631C11"
//             style={styles.loader}
//           />
//         ) : (
//           <FlatList
//             style={styles.list}
//             data={books}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.bookItem}>
//                 {item.volumeInfo.imageLinks?.thumbnail && (
//                   <Image
//                     source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
//                     style={styles.thumbnail}
//                   />
//                 )}
//                 <View style={styles.bookInfo}>
//                   <Text style={styles.title}>{item.volumeInfo.title}</Text>
//                   <Text>{item.volumeInfo.authors?.join(", ")}</Text>
//                   <Text>{item.volumeInfo.publishedDate}</Text>
//                 </View>
//               </View>
//             )}
//             ListEmptyComponent={<Text>Nenhum livro encontrado.</Text>}
//           />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     paddingHorizontal: 4,
//     width: "100%",
//     height: "100%",
//   },
//   content: {
//     flex: 1,
//     gap: 50,
//   },
//   h1: {
//     fontSize: 30,
//     fontWeight: "500",
//     marginLeft: 10,
//     marginVertical: -20,
//   },
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
// });
