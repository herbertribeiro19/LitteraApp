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

export const createBook = async (bookData) => {
  try {
    // Recupera o token e o userId armazenados
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    // Verifica se ambos o token e o userId existem
    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const response = await api.post(
      `/books`,
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

export const updateBookId = async (idBook, bookData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const response = await api.put(`/books/${idBook}`, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Erro ao buscar imagem do livro:", error);
    throw error.response ? error.response.data : "Erro ao buscar imagem";
  }
};

export const deleteBookId = async (idBook) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const response = await api.delete(`/books/${idBook}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Erro ao buscar imagem do livro:", error);
    throw error.response ? error.response.data : "Erro ao buscar imagem";
  }
};

export const desactivateBook = async (idBook) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const bookData = {
      isActive: false, // Atualiza o campo isActive para false
    };

    const response = await api.put(`/books/${idBook}`, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Erro ao desativar o livro:", error);
    throw error.response ? error.response.data : "Erro ao desativar o livro";
  }
};

export const activateBook = async (idBook) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const bookData = {
      isActive: true, // Atualiza o campo isActive para true
    };

    const response = await api.put(`/books/${idBook}`, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Erro ao ativar o livro:", error);
    throw error.response ? error.response.data : "Erro ao ativar o livro";
  }
};
