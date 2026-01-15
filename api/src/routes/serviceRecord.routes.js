import express from "express";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} from "../controllers/serviceRecord.controller.js";

const router = express.Router();

router.post("/", createRecord);
router.get("/", getRecords);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;
