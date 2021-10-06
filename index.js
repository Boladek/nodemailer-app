const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer'); 
const path = require('path');

const app = express();

//View engine setup
// app.engine('hbs', exphbs());
app.engine('hbs', exphbs({
      extname:'hbs', 
      defaultLayout:false,
      layoutDir:__dirname+'/views/layout/', 
      partialsDir:__dirname+'/views/partials/'
    }
    ))
app.set('view engine', 'hbs');

app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
})

app.post('/send', async (req, res) => {
    try {
        let testAccount = await nodemailer.createTestAccount();
        let output = `
        <h3>YOU HAVE A NEW MAIL</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: "idella.smith98@ethereal.email",
              pass: "WZXku9Cd7P7adsVfdK",
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let options = {
            from: '"Nodemailer contact form" <idella.smith98@ethereal.email>', // sender address
            to: "bmubarak88@gmail.com", // list of receivers
            subject: "Node Contact Request", // Subject line
            text: "Hello world?", // plain text body
            html: output, // html body
        }

        let info = await transporter.sendMail(options);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });

    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log(`Server started ...`)
});