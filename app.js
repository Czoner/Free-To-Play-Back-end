const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const { PORT = 3002 } = process.env;

const app = express();
app.use(cors());

const proxyMiddleware = createProxyMiddleware({
    target: "https://www.freetogame.com/api",
    changeOrigin: true,
});
app.use("/api", proxyMiddleware);

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});
