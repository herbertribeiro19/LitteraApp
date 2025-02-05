import axios from "axios";

const api = axios.create({
  baseURL: "http://hfb.digital:3000/api", // Altere para sua API real
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
