import app from "./app";

const port = 4000;

app.listen(port, function () {
  console.log(`Express Server initiated listening on port ${port}`);
});

process.on("SIGTERM", function () {
  console.log("SIGTERM signal received: closing HTTP server.");
  process.exit();
});

process.on("SIGINT", function () {
  console.log("SIGINT signal received: closing HTTP server.");
  process.exit();
});
