import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getMeusInteresses } from "../../services/api/interesse"; // Importando o serviço
import { ChevronLeft } from "lucide-react-native"; // Ícone de voltar
import { LinearGradient } from "expo-linear-gradient";

export default function MeusInteresses() {
  const [interesses, setInteresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchInteresses = async () => {
    try {
      const response = await getMeusInteresses();
      console.log("Meus interesses:", response);
      setInteresses(response);
    } catch (error) {
      console.log("Erro ao carregar meus interesses", error);
      Alert.alert("Erro", "Não foi possível carregar seus interesses.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInteresses();
    }, [])
  );

  const handlePressBook = (bookId) => {
    const book = interesses.find((item) => item.id === bookId); // Encontra o livro completo baseado no ID
    console.log("Livro encontrado:", book); // Verifique se o livro está sendo encontrado corretamente
    navigation.navigate("DetailsBook", { book: book }); // Passa o livro completo para a página de detalhes
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => handlePressBook(item.id)} // Passando o id do livro para a página de detalhes
      >
        <Text style={styles.bookTitle}>{item.nome}</Text>
        <Text style={styles.bookTitle}>{item.cidade}</Text>
        <Text style={styles.bookTitle}>{item.valor}</Text>
        
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Interesses</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#631C11" />
      ) : interesses.length === 0 ? (
        <Text style={styles.noInterestsText}>
          Você ainda não demonstrou interesse em nenhum livro.
        </Text>
      ) : (
        <FlatList
          data={interesses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "20%",
    marginBottom: 15,
    marginHorizontal: 16,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#631C11",
  },
  listContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#631C11",
  },
  noInterestsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#7a7a7a",
    textAlign: "center",
    marginTop: 20,
  },
});
