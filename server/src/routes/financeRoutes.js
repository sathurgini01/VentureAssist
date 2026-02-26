import { Router } from "express";
import {protectMarketing} from "../middleware/authMiddlewareMarketing.js";
import * as controller from "../controllers/financeController.js";
import * as breakeven from "../services/breakevenService.js";
import * as currency from "../services/currencyService.js";

const router = Router();

router.get("/breakeven/:id", async (req, res) => {
  const months = await breakeven.getBreakEven(req.params.id);
  res.json({ breakEvenMonths: months });
});

router.get("/exchange", async (req, res) => {
  const { from, to } = req.query;
  const rate = await currency.getRate(from, to);
  res.json({ rate });
});

router.post("/", protectMarketing, controller.createProfile);
router.get("/:id", protectMarketing, controller.getProfile);
router.put("/:id", protectMarketing, controller.updateProfile);
router.delete("/:id", protectMarketing, controller.deleteProfile);


export default router;