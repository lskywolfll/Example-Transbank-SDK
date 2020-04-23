const express = require("express")
const bodyParser = require("body-parser")
const Transbank = require("transbank-sdk")
const WebpayPlusController = require('./controllers/WebpayNormalController')
const app = express()
const port = 3000
// set the view engine to ejs
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.render("home")
})

/*
 |--------------------------------------------------------------------------
 | Webpay Plus Normal
 |--------------------------------------------------------------------------
 */
app.get("/webpay-normal/init", (req, res) => {
  const transbank = new WebpayPlusController;
  transbank.WebpayPlusNormal(req, res);
})

app.post("/webpay-normal/response", (req, res) => {
  const transbank = new WebpayPlusController;
  transbank.ResponseWebpayPlusNormal(req, res);
})

app.post("/webpay-normal/finish", WebpayPlusController.finish)

app.listen(port, () => console.log(`Ejecutando demo en http://localhost:${port} 🚀`))
