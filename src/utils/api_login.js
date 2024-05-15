import axios from "axios";
const url = "http://localhost:8888";

export const getLogin = async (data) => {
  const res = await axios.post(
    `${url}/users/login`,
    JSON.stringify(data), //* data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return res.data;
};
