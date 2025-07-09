const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const opaque = require('./opaque');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/opaque/register-init", (req, res) => {
  res.json(opaque.opaqueRegisterInit(req.body));
});
app.post("/opaque/register-finish", (req, res) => {
  res.json(opaque.opaqueRegisterFinish(req.body));
});
app.post("/opaque/login-init", (req, res) => {
  res.json(opaque.opaqueLoginInit(req.body));
});
app.post("/opaque/login-finish", (req, res) => {
  res.json(opaque.opaqueLoginFinish(req.body));
});

const credentials = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

const server = https.createServer(credentials, app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

server.listen(3000, () => {
  console.log("OPAQUE WebSocket Server running on https://localhost:3000");
});