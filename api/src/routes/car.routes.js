import express from "express";
import { createCar } from "../controllers/car.controller.js";

const router = express.Router();
router.post("/", createCar);

export default router;
