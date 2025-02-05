import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createImage = async (imageData) => {
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
      `/imagens`, // Passando o userId na URL (se necessário)
      imageData, // Envia o payload com os dados do livro
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        },
      }
    );
    console.log("Resposta da API para upload de imagem:", response);

    return response.data;
  } catch (error) {
    console.log("Erro ao Salvar Imagem:", error);
    throw error.response ? error.response.data : "Erro ao Salvar Imagem";
  }
};
