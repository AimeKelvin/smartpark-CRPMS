import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "./config/session.js";

import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/car.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import serviceRecordRoutes from "./routes/serviceRecord.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reportRoutes from "./routes/report.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session);

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-records", serviceRecordRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);

export default app;
