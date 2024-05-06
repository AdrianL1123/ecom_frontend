import axios from "axios";
const url = "http://localhost:8888";

export const getCategories = async () => {
  try {
    const response = await axios.get(`${url}/categories`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
