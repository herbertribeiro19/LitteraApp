import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getBook = async () => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Resposta do getUser:", response.data);
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar dados do usuário:", error);
    throw error.response ? error.response.data : "Erro ao trazer usuário";
  }
};

export const getBookId = async (idBook) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const response = await api.get(`/books/${idBook}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Resposta da API de imagem:", response.data); // Verifica a resposta

    return response.data;
  } catch (error) {
    console.log("Erro ao buscar imagem do livro:", error);
    throw error.response ? error.response.data : "Erro ao buscar imagem";
  }
};

export const postInteresse = async (bookData) => {
  try {
    // Recupera o token e o userId armazenados
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    // Verifica se ambos o token e o userId existem
    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Envia a requisição POST para salvar as preferências
    const response = await api.post(
      `/interesses`, // Passando o userId na URL (se necessário)
      bookData, // Envia o payload com os dados do livro
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Erro ao Salvar Livro:", error);
    throw error.response ? error.response.data : "Erro ao Salvar Livro";
  }
};
