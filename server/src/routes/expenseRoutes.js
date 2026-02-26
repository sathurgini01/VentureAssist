import { Router } from "express";
import * as controller from "../controllers/expenseController.js";

const router = Router();

router.post("/", controller.addExpense);
router.get("/:profileId", controller.getExpenses);
router.put("/:id", controller.updateExpense);
router.delete("/:id", controller.deleteExpense);

export default router;