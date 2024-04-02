import express from "express";
const app = express();

app.get("/", (req, res) => {
  // send response
  res.send("Working on");
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
