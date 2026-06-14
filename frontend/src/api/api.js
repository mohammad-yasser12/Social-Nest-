import axios from "axios";

const API = axios.create({
  baseURL: "https://social-nest-1-flyx.onrender.com/api",
  withCredentials: true,
});

export default API;