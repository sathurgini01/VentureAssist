import { Router } from "express";
import * as controller from "../controllers/expenseController.js";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";

const router = Router();

router.post("/", protectMarketing, controller.addExpense);
router.get("/:profileId", protectMarketing, controller.getExpenses);
router.put("/:id", protectMarketing, controller.updateExpense);
router.delete("/:id", protectMarketing, controller.deleteExpense);

export default router;