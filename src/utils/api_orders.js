import axios from "axios";
const url = "http://localhost:8888";

export const getOrders = async () => {
  const query = new URLSearchParams();
  const res = await axios.get(`${url}/orders?${query.toString()}`);
  return res.data;
};

export const addNewOrder = async (data) => {
  const response = await axios.post(
    `${url}/orders`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return response.data;
};

export const updateOrder = async (data) => {
  const res = await axios.put(
    `${url}/orders/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await axios.delete(`${url}/orders/${id}`);
  return res.data;
};
