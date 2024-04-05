import axios from "axios";
import backendUrl from "../backendUrl";
import axiosInstance from "./axiosInstance";
export let token = null;

const setToken = (newToken) => {
  token = newToken;
  console.log("Token set:", newToken);
};

const getToken = () => {
  return token;
};

const setConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const signup = async (enteredData) => {
  const response = await axios.post(`${backendUrl}/api/signup`, enteredData);
  console.log(response.data);
  return response.data;
};

const login = async (credentials) => {
  try {
    console.log(
      "Login service: Sending login request with credentials:",
      credentials
    );
    const response = await axiosInstance.post(
      `${backendUrl}/api/login`,
      credentials
    );
    console.log("Login service: Response received:", response.data);

    const token = response.data.token;
    authService.setToken(token);
    return token;
  } catch (error) {
    console.error("Login service: Error occurred:", error);
    throw error;
  }
};

const authService = { setToken, signup, login, setConfig, getToken };

export default authService;
