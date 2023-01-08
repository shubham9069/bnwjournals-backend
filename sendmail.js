
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


 const mail= async(name, email, phone, subject,message,)=>{

    let transporter =  nodemailer.createTransport(smtpTransport({
          
        host: 'smtp.hostinger.com',
        port:465,
        secure: true,       // true ssl
        // logger: true,
        // debug: true,
        // ignoreTLS:true,
        auth:{
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
            requestCert: true,//add when working with https sites
agent: true,//add when working with https sites
        }
        
     
    }));
    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              console.log("Server is ready to take our messages");
              resolve(success);
          }
      });
  });

     let maildetails = {
        from: ` "contact us testing " <bnw-testing@shubham.org.in>`,
        to: email, // list of receivers
        subject: subject, // Subject line                                                           // client side revert 
        text: message, // plain text body
        html: `<h1> thanku for contact us we help you soon  </h1>
                   <h2> name = ${name} </h2>
                   <h2>email = ${email} </h2>
                   <h2>phone = ${phone } </h2>
                   <p>message  = ${message } </p>`
    }
    
   return transporter.sendMail(maildetails)
      
    
}

        // mail system for reset password 


const emailverificationforreset= async(email,cotp,name)=>{

  let transporter =  nodemailer.createTransport(smtpTransport({
        
      host: 'smtp.hostinger.com',
      port:465,
      secure: true,       // true ssl
      // logger: true,
      // debug: true,
      // ignoreTLS:true,
      auth:{
          user:process.env.EMAIL_ADDRESS,
          pass:process.env.PASSWORD
      },
//       tls: {
//           rejectUnauthorized: false,
//           requestCert: false,//add when working with https sites
// agent: false,//add when working with https sites
//       }


      
   
  }));
  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("Server is ready to take our messages");
            resolve(success);
        }
    });
});

   let maildetails = {
      from: ` "reset your password" <bne-testing@shubham.org.in>`,
      to: email, // list of receivers
      subject: "Rsest your password  ", // Subject line                                                          // client side revert 
      html:     `<h1> dear ${name } your otp is ${cotp}</h1>                                                        
          <p>donot not share your otp with some one it will expire with 30 min </p>   `                                                       
       
      
        
  }
  
  return transporter.sendMail(maildetails)
  
}
const registration= async(email,cotp)=>{

  let transporter =  nodemailer.createTransport(smtpTransport({
        
      host: 'smtp.hostinger.com',
      port:465,
      secure: true,       // true ssl
      // logger: true,
      // debug: true,
      // ignoreTLS:true,
      auth:{
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.PASSWORD
      },
//       tls: {
//           rejectUnauthorized: false,
//           requestCert: false,//add when working with https sites
// agent: false,//add when working with https sites
//       }
      
   
  }));
  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("Server is ready to take our messages");
            resolve(success);
        }
    });
});

   let maildetails = {
      from: ` "otp for registration " <bnw-testing@shubham.org.in>`,
      to: email, // list of receivers
      subject: "thanku Registered in our websites", // Subject line                                                           // client side revert 
      html:     `<h1> plz confirm its you and complete your registration  </h1>                                                      
    <h1> your otp is ${cotp}</h1>
    <p>donot not share your otp with some one it will expire with 30 min </p> `                                                       
       
      
        
  }
  
  return transporter.sendMail(maildetails)
  
}
 
    

module.exports = {mail,emailverificationforreset, registration}
    
   




