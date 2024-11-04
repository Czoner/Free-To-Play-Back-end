require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const { default: mongoose } = require("mongoose");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const limiter = require("./utils/Limiter");
const { errorHandler } = require("./middlewares/Error-Handler");
const { requestLogger, errorLogger } = require("./middlewares/Logger");

const { PORT = 3002 } = process.env;

const app = express();

app.use(limiter);
app.use(helmet());
app.use(express.json());

app.use(cors());
app.use(requestLogger);
app.get("/crash-test", () => {
    setTimeout(() => {
        throw new Error("Server will crash now");
    }, 0);
});

const proxyMiddleware = createProxyMiddleware({
    target: "https://www.freetogame.com/api",
    changeOrigin: true,
});
app.use("/", proxyMiddleware);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
    .connect("mongodb://127.0.0.1:27017/MyFP_db")
    .then(() => {
        console.log("Connected to the DB");
    })
    .catch(console.error);

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});
