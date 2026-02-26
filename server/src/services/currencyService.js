import axios from "axios";

export const getRate = async (from, to) => {
  const res = await axios.get(
    `https://open.er-api.com/v6/latest/${from}`
  );

  return res.data.rates[to];
};