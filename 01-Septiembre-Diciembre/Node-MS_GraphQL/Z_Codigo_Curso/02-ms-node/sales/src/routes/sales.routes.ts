import { Router } from "express";
import { createSale, getAll } from "../controllers/sales.controller";

const router = Router();

// GET: /sales/all
router.get("/all", getAll);

router.post("/create", createSale);

export default router;
