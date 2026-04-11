import Expense from "../models/Expense.js";
import FinanceProfile from "../models/FinanceProfile.js";

export const addExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  await FinanceProfile.findByIdAndUpdate(req.body.profileId, {
    $inc: { monthlyExpenses: expense.amount }
  });
  res.json(expense);
};

export const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ profileId: req.params.profileId });
  res.json(expenses);
};

export const updateExpense = async (req, res) => {
  const oldDoc = await Expense.findById(req.params.id);
  const updated = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (oldDoc && updated) {
    await FinanceProfile.findByIdAndUpdate(updated.profileId, {
      $inc: { monthlyExpenses: updated.amount - oldDoc.amount }
    });
  }

  res.json(updated);
};

export const deleteExpense = async (req, res) => {
  const doc = await Expense.findByIdAndDelete(req.params.id);
  if (doc) {
    await FinanceProfile.findByIdAndUpdate(doc.profileId, {
      $inc: { monthlyExpenses: -doc.amount }
    });
  }
  res.json({ message: "Deleted" });
};