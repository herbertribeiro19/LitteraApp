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

export const notificationRead = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Token não encontrado");
    }

    console.log("Token:", token);
    console.log("Fazendo requisição PATCH...");
    const response = await api.patch(
      "/notifications/read",
      {}, // Corpo vazio, já que a API não espera dados no corpo
      {
        headers: {
          accept: "*/*", // Adicionado o header 'accept'
          Authorization: `Bearer ${token}`, // Token no header 'Authorization'
        },
      }
    );

    console.log("Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    console.log("Erro ao atualizar as notificações: ", error);

    // Tratamento de erro aprimorado
    if (error.response) {
      // Erro retornado pela API (ex: 401, 500)
      throw {
        message: error.response.data.message || "Erro ao atualizar notificação",
        status: error.response.status,
      };
    } else if (error.request) {
      // Erro de rede (ex: sem resposta do servidor)
      throw { message: "Sem resposta do servidor. Verifique sua conexão." };
    } else {
      // Outros erros (ex: erro de sintaxe)
      throw { message: "Erro ao processar a requisição." };
    }
  }
};
