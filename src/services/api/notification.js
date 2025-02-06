import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getNotification = async (bookId) => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/notifications`, {
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
