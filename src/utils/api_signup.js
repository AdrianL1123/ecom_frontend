import axios from "axios";
const url = "http://localhost:8888";

export const getSignUp = async (data) => {
  const res = await axios.post(`${url}/users/signup`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
