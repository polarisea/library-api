const fs = require("fs");
const https = require("https");
const privateKey = fs.readFileSync("./sslcert/private.key", "utf8");
const certificate = fs.readFileSync("./sslcert/certificate.crt", "utf8");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const {
  PORT,
  MONGODB_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("./constants");

const authApi = require("./routes/auth");
const BookApi = require("./routes/book.route");
const CategoryApi = require("./routes/category.route");
const AuthorApi = require("./routes/author.route");
const ContractApi = require("./routes/contract.route");
const VoteApi = require("./routes/vote.route");
const UserApi = require("./routes/user.route");

const credentials = { key: privateKey, cert: certificate };
const app = express();
const httpsServer = https.createServer(credentials, app);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

app.use("/api/auth", authApi);
app.use("/api/books", BookApi);
app.use("/api/categories", CategoryApi);
app.use("/api/authors", AuthorApi);
app.use("/api/contracts", ContractApi);
app.use("/api/votes", VoteApi);
app.use("/api/users", UserApi);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Kết nối thành công đến MongoDB");
    httpsServer.listen(PORT, () => {
      console.log(`Server Express đang lắng nghe trên cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối đến MongoDB:", err);
  });
