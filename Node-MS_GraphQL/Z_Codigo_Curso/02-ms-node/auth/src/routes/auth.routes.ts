import { Router } from "express";

import {
  validateEmailMiddleware,
  validateEmailRegistryMiddleware,
} from "../middlewares/validateEmail.middleware";

import {
  hashPasswordMiddleware,
  validatePasswordMiddleware,
} from "../middlewares/hashPassword.middleware";

import {
  verifyGoogleIdTokenMiddleware,
  verifyJWTMiddleware,
} from "../middlewares/verifyJWT.middleware";

import {
  googleSSO,
  login,
  register,
  renewToken,
} from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  [validateEmailMiddleware, hashPasswordMiddleware],
  register
);

router.post(
  "/login",
  [validateEmailRegistryMiddleware, validatePasswordMiddleware],
  login
);

router.post("/google", [verifyGoogleIdTokenMiddleware], googleSSO);

router.post("/renew-jwt", [verifyJWTMiddleware], renewToken);

export default router;
