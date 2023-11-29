const fs = require("fs");
const https = require("https");
const privateKey = fs.readFileSync("./sslcert/private.key", "utf8");
const certificate = fs.readFileSync("./sslcert/certificate.crt", "utf8");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { setSchedule } = require("./schedule");

const { PORT, MONGODB_URL } = require("./constants");

const authApi = require("./routes/auth");
const UserApi = require("./routes/user");
const BookApi = require("./routes/book");
const CategoryApi = require("./routes/category");
const AuthorApi = require("./routes/author");
const PublisherApi = require("./routes/publisher");
const ContractApi = require("./routes/contract");
const NotifyApi = require("./routes/notify");
const VoteApi = require("./routes/vote.route");
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
app.use("/api/publishers", PublisherApi);
app.use("/api/notifies", NotifyApi);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Kết nối thành công đến MongoDB");
    setSchedule();
    httpsServer.listen(PORT, () => {
      console.log(`Server Express đang lắng nghe trên cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối đến MongoDB:", err);
  });
