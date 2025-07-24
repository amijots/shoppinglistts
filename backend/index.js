const express = require('express');
const bodyParser = require('body-parser');
const InitiateMongoServer = require("./config/db")
const list = require("./routes/list");
const cors = require('cors');
// const { createServer } = require("https"); // you can use https as well
// const socketIo = require("socket.io");

InitiateMongoServer();
const app = express();
const port = Number(process.env.PORT) || 3000;

// const server = createServer(app);
// const io = socketIo(server, { cors: { origin: "http://localhost:3000/list/" } });

app.use(bodyParser.json());
app.use(cors());

//try and see if list.use... works (it'll restrict the middleware to only /list/... route)
// app.use((req, res, next) => {
//   req.io = io;
//   return next();
// });

app.get('/', (req, res) => {
  res.json({message: "API Working"});
});

// the router only gets used when url has /list/...
app.use("/list", list);
app.listen(port);
// app.listen(3000, () => console.log(`Server started at PORT 3000!`));
// server.listen(3000, () => console.log(`Server started at PORT 3000!`));

