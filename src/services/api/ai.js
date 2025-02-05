import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PostIA = async () => {
  try {
    // Recupera o token de autenticação, caso necessário
    const token = await AsyncStorage.getItem("token");

    // Verifica se o token existe
    if (!token) {
      throw new Error("Token de autenticação não encontrado.");
    }

    // Faz a requisição POST, incluindo o cabeçalho Authorization e o corpo da requisição
    const response = await api.post(
      "/chat/prompt",
      {}, // Aqui você pode passar o corpo da requisição, se necessário
      {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o token de autenticação
          accept: "*/*", // Cabeçalho 'accept' conforme seu curl
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Erro ao chamar a API:", error);
    // Retorna uma mensagem de erro genérica ou personalizada
    throw error.response ? error.response.data : "Erro ao chamar a API";
  }
};
