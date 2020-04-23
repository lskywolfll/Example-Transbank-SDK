const Transbank = require("transbank-sdk")
const { getRandomInt } = require("../helpers")

const transactions = {}

class WebpayPlusController {

  constructor() {
    this.configuration;
    this.method;
    this.response;
  }

  WebpayPlusNormal(req, res) {
    this.configuration = Transbank.Configuration.forTestingWebpayPlusNormal()
    this.method = new Transbank.Webpay(this.configuration).getNormalTransaction()
    this.response = this.method;
    let url = `${req.protocol}://${req.get('host')}`

    let amount = 1500
    this.method.initTransaction(
      amount,
      getRandomInt(10000, 99999),
      req.sessionId,
      url + "/webpay-normal/response",
      url + "/webpay-normal/finish"
    ).then((data) => {
      transactions[data.token] = { amount: amount }
      const { url, token } = data;
      res.render("redirect-transbank",
        { url: url, token: token, inputName: "TBK_TOKEN" })
    })
  }

  ResponseWebpayPlusNormal(req, res) {
    // Esta inicialización que se repite, es mejor llevarla a nu lugar en donde
    // se pueda reutilizar. Por simplicidad, en este ejemplo está el código
    // duplicado en cada método

    let token = req.body.token_ws

    this.response.getTransactionResult(token).then(response => {
      transactions[token] = response
      const { urlRedirection } = response;
      res.render("redirect-transbank",
        { url: urlRedirection, token, inputName: "token_ws" })
    }).catch((e) => {
      console.log(e)
      res.send("Error")
    })
  }

  static response(req, res) {
    // Esta inicialización que se repite, es mejor llevarla a nu lugar en donde
    // se pueda reutilizar. Por simplicidad, en este ejemplo está el código
    // duplicado en cada método
    const configuration = Transbank.Configuration.forTestingWebpayPlusNormal()
    let Webpay = new Transbank.Webpay(configuration).getNormalTransaction()

    let token = req.body.token_ws

    Webpay.getTransactionResult(token).then(response => {
      transactions[token] = response
      res.render("redirect-transbank",
        { url: response.urlRedirection, token, inputName: "token_ws" })
    }).catch((e) => {
      console.log(e)
      res.send("Error")
    })
  }

  static finish(req, res) {
    let status = null;
    let transaction = null;

    // Si se recibe TBK_TOKEN en vez de token_ws, la compra fue anulada por el usuario
    if (typeof req.body.TBK_TOKEN !== "undefined") {
      status = 'ABORTED';
    }

    if (typeof req.body.token_ws !== "undefined") {
      transaction = transactions[req.body.token_ws];
      if (transaction.detailOutput[0].responseCode === 0) {
        status = 'AUTHORIZED';
      } else {
        status = 'REJECTED';
      }
    }

    // Si no se recibió ni token_ws ni TBK_TOKEN, es un usuario que entró directo
    if (status === null) {
      return res.status(404).send("Not found.");
    }

    return res.render("webpay-normal/finish", { transaction, status })

  }

}

module.exports = WebpayPlusController
