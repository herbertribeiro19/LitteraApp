import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getTransactions = async () => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/TypeTransaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Resposta do getUser:", response.data);
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar dados da transação", error);
    throw error.response ? error.response.data : "Erro ao trazer transação";
  }
};
