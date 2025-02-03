import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createBook = async (bookData) => {
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
      `/books`, // Passando o userId na URL (se necessário)
      bookData, // Envia o payload com os dados do livro
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Erro ao Salvar Preferências:", error);
    throw error.response ? error.response.data : "Erro ao Salvar Preferências";
  }
};
