import { Router } from "express";
import * as controller from "../controllers/revenueController.js";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";

const router = Router();

router.post("/", protectMarketing, controller.addRevenue);
router.get("/:profileId", protectMarketing, controller.getRevenue);
router.put("/:id", protectMarketing, controller.updateRevenue);
router.delete("/:id", protectMarketing, controller.deleteRevenue);

export default router;