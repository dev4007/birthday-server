// index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./src/routes/auth/routes.js";
import customerRouter from "./src/routes/customer/routes.js";
import artistRouter from "./src/routes/artist/routes.js";
import adminRouter from "./src/routes/admin/routes.js";




import dotenv from "dotenv";
import connectDB from "./src/config/db.js"

dotenv.config();
const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// auth routes
app.use("/api/auth", router);
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/artist", artistRouter);


app.listen(port, () => {
  console.log(`User service running at http://localhost:${port}`);
});
