const dotenv= require("dotenv");
dotenv.config();
const nodemailer=require("nodemailer");

let transporter= nodemailer.createTransport({
    host:'mail.teamrabbil.com',
    port:25,
    // service:"gmail",
    secure:false, //true for port= 465 and other port false
    auth:{
        user: "info@teamrabbil.com",
        pass: '~sR4[bhaC[Qs'
    },tls: {
        rejectUnauthorized: false
    },
   
})
module.exports={transporter};