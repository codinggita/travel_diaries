const express = require("express");
const cors = require("cors");
const request = require("request");

const app = express();
app.use(cors());

app.get("/proxy", (req, res) => {
  const targetURL = req.query.url; // Get the URL from the query parameter
  if (!targetURL) return res.status(400).send("URL is required");

  // Send the request to the target URL
  request(targetURL, (error, response, body) => {
    if (error) return res.status(500).send("Error fetching the URL");
    res.send(body); // Send the content back to the frontend
  });
});

app.listen(5000, () => {
  console.log("Proxy server running on port 5000");
});
