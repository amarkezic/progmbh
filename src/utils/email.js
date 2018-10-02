import nodemailer from "nodemailer"

nodemailer.createTestAccount()
let mailClient = new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
        if(err) {
            reject(err);
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass // generated ethereal password
            }
        });
        resolve(transporter)
    });
})


export default mailClient