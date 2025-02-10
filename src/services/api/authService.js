import api from "./api";

// Criar conta (Registro)
export const registerUser = async (name, nickname, email, password, phone) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      nickname,
      email,
      password,
      phone,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Erro ao registrar usuário";
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Erro ao fazer login";
  }
};
