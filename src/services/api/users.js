import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUser = async () => {
  try {
    // Obtendo o token e o ID do usuário armazenados no AsyncStorage
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    // Fazendo a requisição para obter os dados do usuário
    const response = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Resposta do getUser:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error.response ? error.response.data : "Erro ao trazer usuário";
  }
};

export const editUser = async (name, nickname, email, phone) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Token ou ID do usuário não encontrado");
    }

    const response = await api.put(
      `/users/${userId}`,
      { name, nickname, email, phone }, // Enviando os dados atualizados
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error.response ? error.response.data : "Erro ao atualizar usuário";
  }
};
