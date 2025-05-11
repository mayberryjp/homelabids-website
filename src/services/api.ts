import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL + "/api";

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
