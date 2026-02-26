import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
};

export const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ profileId: req.params.profileId });
  res.json(expenses);
};

export const updateExpense = async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};