
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config({path: "./config.env/"});
app.use(express.json());
require('./db/connection');
const cors = require('cors');





app.use(cors({
    origin: ['http://localhost:3000','https://journals-3ae25.firebaseapp.com'],
    preflightContinue: true,
    credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}));

app.use(cookieParser());



app.use(require('./router/auth'));
app.use(require('./router/admin'));

app.use("/images", express.static("./images"));
const PORT = process.env.PORT;


// app.get('/aboutme', (req, res) => {

//     res.send('Welcome to aboutme page ')
// })



app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);

})
