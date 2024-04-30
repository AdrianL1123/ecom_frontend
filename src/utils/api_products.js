import axios from "axios";

const API_URL = "http://localhost:8888";

export const getProducts = async (category) => {
  try {
    let params = {};
    if (category !== "all") {
      params.category = category;
    }
    const queries = new URLSearchParams(params);
    const response = await axios.get(
      API_URL + "/products?" + queries.toString()
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getProduct = async (id) => {};

export const addProduct = async (data) => {};

export const updateProduct = async (id, data) => {};

export const deleteProduct = async (id) => {};
