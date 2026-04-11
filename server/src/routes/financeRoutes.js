import { Router } from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import * as controller from "../controllers/financeController.js";
import * as breakeven from "../services/breakevenService.js";
import * as currency from "../services/currencyService.js";
import * as intelligenceService from "../services/financialIntelligenceService.js";

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

router.get("/intelligence/:id", protectMarketing, async (req, res) => {
  try {
    const report = await intelligenceService.generateFinancialReport(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protectMarketing, controller.createProfile);
router.get("/", protectMarketing, controller.getAllProfiles);
router.get("/:id", protectMarketing, controller.getProfile);
router.put("/:id", protectMarketing, controller.updateProfile);
router.delete("/:id", protectMarketing, controller.deleteProfile);


export default router;