import axios from "axios";

const API = axios.create({
 
  baseURL: "https://employee-management-system1-2.onrender.com",
});

export default API;