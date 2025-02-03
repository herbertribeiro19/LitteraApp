import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGenero } from "../../services/api/genero";
import {
  preferenciesUser,
  getUserPreferences,
} from "../../services/api/preferencies"; // Importando a função
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Preferencies() {
  const navigation = useNavigation();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Recupera o userId armazenado
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);

        // Carrega os gêneros disponíveis
        const fetchedGenres = await getGenero();
        setGenres(fetchedGenres.genero);

        if (userId) {
          // Obtém as preferências salvas para o usuário
          const userPreferences = await getUserPreferences(userId);
          const savedGenres = userPreferences.map((pref) => pref.GeneroId);
          setSelectedGenres(savedGenres); // Marcar os gêneros salvos como selecionados
        }
      } catch (error) {
        // Alert.alert("Erro", "Não foi possível carregar as preferências.");
      }
    };

    fetchData();
  }, []);

  const toggleGenre = (id) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((genreId) => genreId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSavePreferences = async () => {
    if (selectedGenres.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um gênero.");
      return;
    }

    try {
      // Obter o ID do usuário logado
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        console.log("Erro: Nenhum usuário logado.");
        return;
      }

      // Salvar as preferências do usuário
      await preferenciesUser(selectedGenres);

      // Atualizar o AsyncStorage para indicar que ESSE usuário já passou pela tela de preferências
      await AsyncStorage.setItem(`hasSelectedPreferences_${userId}`, "true");

      // Verificar o valor salvo
      const hasSelectedPreferences = await AsyncStorage.getItem(
        `hasSelectedPreferences_${userId}`
      );
      console.log(
        "hasSelectedPreferences após salvar:",
        hasSelectedPreferences
      );

      Alert.alert("Sucesso", "Preferências salvas com sucesso!");
      navigation.navigate("HomeTabs"); // Redirecionar para a Home
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as preferências.");
    }
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.boxmain}>
        <Text style={styles.textbold}>Preferências</Text>
        <Text style={styles.textspan}>
          Selecione os seus gêneros de livros preferidos na lista
        </Text>
      </View>
      <View style={styles.boxList}>
        <FlatList
          data={genres}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.genreItem,
                selectedGenres.includes(item.id) && styles.selectedItem,
              ]}
              onPress={() => toggleGenre(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={selectedGenres.includes(item.id) ? "#fff" : "#631C11"}
              />
              <Text
                style={[
                  styles.genreText,
                  selectedGenres.includes(item.id) && styles.selectedText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.btnsave}
          onPress={handleSavePreferences}
        >
          <Text style={styles.textbtnsave}>Salvar Preferências</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btncancel}
          onPress={() => navigation.navigate("HomeTabs")}
        >
          <Text style={styles.textbtncancel}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: "#F5F3F1",
  //     flexDirection: "column",
  //   },
  boxmain: {
    marginTop: "24%",
    marginHorizontal: "6%",
    justifyContent: "left",
    flexDirection: "column",
    alignSelf: "left",
    gap: "4%",
  },
  boxList: {
    marginHorizontal: "3%",
    flexDirection: "column",
    height: "60%",
  },
  textbold: {
    color: "#631C11",
    fontSize: 26,
    fontWeight: "600",
  },
  textspan: {
    color: "#631C11",
    marginTop: "1%",
    fontSize: 12,
    fontWeight: "300",
  },
  textBold: {
    fontSize: 22,
    fontWeight: "bold",
  },
  genreItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#EFE1DE",
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: "#631C11",
  },
  genreText: {
    fontSize: 14,
    color: "#631C11",
  },
  selectedText: {
    color: "#fff",
  },
  btnsave: {
    backgroundColor: "#631C11",
    width: "87%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  textbtnsave: {
    color: "#F5F3F1",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  btncancel: {
    backgroundColor: "#F5F3F1",
    borderColor: "#631C11",
    borderWidth: 0.5,
    width: "86.5%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 14,
  },
  textbtncancel: {
    color: "#631C11",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  content: {
    marginTop: 20,
  },
});
