import axios from "axios";

const url = "http://localhost:8888";

export const verifyPayment = async (data) => {
  const res = await axios.post(`${url}/payment`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json", // telling the API you are sending JSON data
    },
  });
  return res.data;
};
