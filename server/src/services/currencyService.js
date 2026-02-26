import axios from "axios";

export const getRate = async (from, to) => {
  const res = await axios.get(
    `https://api.exchangerate.host/convert?from=${from}&to=${to}`
  );

  return res.data.result;
};