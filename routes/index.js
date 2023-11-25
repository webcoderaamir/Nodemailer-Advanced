var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const googleApis = require("googleapis");

const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `820348108384-q77jqbq2sfhol7qkcmcr2933ldvr1m93.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04eooQnDcrPmKCgYIARAAGAQSNwF-L9IrLFnDhzqv6X-6M-bKL7EgBzZSsafyiLz9-QFyr9JWQxgGt9jpN1U_RVX13vvi_BPBe6I`;

const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
authClient.setCredentials({ refresh_token: REFRESH_TOKEN });


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/send-mail', function (req, res) {
  async function mailer() {
    try {
      const ACCESS_TOKEN = await authClient.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "aamirayub889@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN
        }
      })

      const details = {
        from: req.body.sender,
        to: req.body.reciever,
        subject: req.body.subject,
        html: `<h2 style = "color: red;" >${req.body.message}</h2>`
      }

      const result = await transport.sendMail(details); 
      return result;
    }
    catch (err) {
      return err;
    }
  }

  mailer().then(res => {
    console.log("sent mail !", res);
  })

});

module.exports = router;
