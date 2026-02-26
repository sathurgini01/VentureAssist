import { Router } from "express";
import * as controller from "../controllers/revenueController.js";

const router = Router();

router.post("/", controller.addRevenue);
router.get("/:profileId", controller.getRevenue);

export default router;