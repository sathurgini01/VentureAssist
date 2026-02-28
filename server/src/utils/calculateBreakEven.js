const calculateRunway = (capital, revenue, expenses) => {
  const profit = revenue - expenses;
  if (profit <= 0) return -1;
  return capital / profit;
};

export default calculateRunway;