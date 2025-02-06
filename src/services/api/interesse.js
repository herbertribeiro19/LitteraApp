import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const getMeusInteresses = async () => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/interesses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.books; // Retorna apenas o array de livros
  } catch (error) {
    console.log("Erro ao buscar dados dos meus interesses: ", error);
    throw error.response
      ? error.response.data
      : "Erro ao buscar dados dos meus interesses";
  }
};

export const getInteresse = async (bookId) => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/interesses/bookId/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar dados do interesse:", error);
    throw error.response
      ? error.response.data
      : "Erro ao buscar dados do interesse";
  }
};

export const getInteressadosBook = async (bookId) => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/interesses/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Dados dos interessados:", response.data);
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar dados dos interessados:", error);
    throw error.response
      ? error.response.data
      : "Erro ao buscar dados dos interessados";
  }
};
