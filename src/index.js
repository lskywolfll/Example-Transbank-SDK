const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser")
const Transbank = require("transbank-sdk")
const WebpayPlusController = require('./controllers/WebpayNormalController')
const app = express()
const port = 3001;
// Integration communication constant
const server = app.listen(port, () => console.log(`Ejecutando demo en http://localhost:${port} 🚀`))
const io = require('socket.io')(server);
// set the view engine to ejs
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())


global.io = io;

app.get("/", (req, res) => {
  res.render("home")
})

io.on('connect', () => {
  io.emit('messageNew', {
    Hola: 'Hole pue',

  })
})

/*
 |--------------------------------------------------------------------------
 | Webpay Plus Normal
 |--------------------------------------------------------------------------
 */
app.get("/webpay-normal/init", (req, res) => {
  console.log('alguien entro')
  io.emit('messageNew', {
    Hola: 'dentro del init webpay normal'
  })
  const transbank = new WebpayPlusController();
  transbank.WebpayPlusNormal(req, res);
})

app.post("/webpay-normal/response", (req, res) => {
  const transbank = new WebpayPlusController();
  transbank.ResponseWebpayPlusNormal(req, res);
})

app.post("/webpay-normal/finish", (req, res) => {
  const transbank = new WebpayPlusController();

  transbank.finish(req, res);
})