import { Router } from "express";
import { getAll } from "../controllers/products.controller";

const router = Router();

// GET: /products/all
router.get("/all", getAll);

export default router;
