const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://user-genai-1.onrender.com"
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.routes.js");
const interviewRouter = require("./routes/interview.routes.js");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;