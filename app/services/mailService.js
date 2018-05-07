const jollof = require('jollof');
const config = jollof.config;
const mailConfig = jollof.config.mail;
const moment = require('moment');
const _ = require('lodash');
const mailjet = require('node-mailjet').connect(mailConfig.mailjet.key, mailConfig.mailjet.secret,{
    version: 'v3'
})
const nunjucks = require('nunjucks');
nunjucks.configure('app/views',{})
const path = require('path');



function formatRecipients(to) {
    return Array.isArray(to) ? to.map((address) => {
        return { Email: address }
    }) : [{ Email: to }]
}

/**
 * If you need to send a simple HTML string as email
 * @param to - list of email adresses to send to
 * @param subject
 * @param content - html content to send
 * @returns {Promise<void>}
 */
exports.sendHTMLEmail = async (to, subject, content) => {

    //format to list
    const recipients = formatRecipients(to);

    //send
    return await mailjet
        .post("send")
        .request({
            FromEmail: mailConfig.from,
            FromName: mailConfig.fromName,
            Subject: subject,
            "Html-part": content,
            Recipients: recipients
        });

}

/**
 *
 * @param to
 * @param firstName
 * @param homeUrl
 * @param eventsUrl
 * @returns {Promise<void>}
 */
const sendPassportEmail = exports.sendPassportEmail = async (to, templateId, variables = {}) => {

    try {
        //format to list
        const recipients = formatRecipients(to);

        //send
        const request = await mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: mailConfig.from,
                            Name: mailConfig.fromName
                        },
                        To: [
                            {
                                Email: to
                            }
                        ],
                        TemplateID: templateId,
                        TemplateLanguage: true,
                        Variables: variables
                    }
                ]
            });

        return request;
    } catch (err) {
        //We did not add this user as contact
        console.log(err);
    }
    return null;
}

/**
 *
 * @type {function()}
 */
const sendTemplateEmail = exports.sendTemplateEmail = async (to, subject, templateName, vars) => {
    try {
        const htmlString =  await new Promise((resolve, reject)=>{
            nunjucks.render(`emails/${templateName}.nunj`, vars, function(err, html){
                if(err) {
                    return reject(err)
                }
                resolve(html);
            });
        });
        if(!htmlString) throw new Error('htmlString cannot be null')
        return await exports.sendHTMLEmail(to, subject, htmlString)
    }catch(err){
        throw new Error(`Cannot send Email from Template ${templateName}:${err.statusCode||''}: ${err.message},  ${err.ErrorMessage||''}`, err)
    }
}

/**
 *
 * @type {function({user: *, sendWelcome?: bool})}
 */
const addContact = exports.addContact = async (user, sendWelcome) => {

    //send
    try {
        const request = await mailjet
            .post("contact")
            .request({
                Email: user.email,
                Name: `${user.firstName} ${user.lastName}`
            });

        //after adding a contact, send welcome email if set
        if (sendWelcome) {
            await exports.sendSubscriptionWelcomeEmail({ to: user.email })
        }
    } catch (err) {
        //We did not add this user as contact
        console.log(err);
    }

}



