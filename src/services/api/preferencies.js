import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const preferenciesUser = async (genres) => {
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
      `/preferencias`, // Passando o userId na URL (se necessário)
      { generos: genres }, // Envia os gêneros selecionados
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

export const getUserPreferences = async (userId) => {
  try {
    // Recupera o token armazenado
    const token = await AsyncStorage.getItem("token");

    // Verifica se o token existe
    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Envia a requisição GET para obter as preferências do usuário
    const response = await api.get(`/preferencias/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.preferencias;
  } catch (error) {
    console.log("Erro ao obter preferências:", error);
    throw error.response ? error.response.data : "Erro ao obter preferências";
  }
};
