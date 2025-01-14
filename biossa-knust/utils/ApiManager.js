import axios from "axios";

const link = "https://wins-family.onrender.com";
const ApiManager = axios.create({
  baseURL: `${link}`,
  responseType: "json",
  withCredentials: true,
});

export default ApiManager;
