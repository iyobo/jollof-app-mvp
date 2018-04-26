const jollof = require('jollof');
const config = jollof.config;
const mailConfig = jollof.config.mail;
const moment = require('moment');
const _ = require('lodash');
const mailjet = require('node-mailjet').connect(mailConfig.mailjet.key, mailConfig.mailjet.secret)
const nunjucks = require('nunjucks');
nunjucks.configure('../views/emails', { autoescape: true });

function formatRecipients(to, name) {
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
    const htmlString = nunjucks.render(templateName, vars);
    return await exports.sendHTMLEmail(to, subject, htmlString)
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

// ===========Action messages
/**
 * Yay! We got a new user.
 *
 * @param to
 * @param user
 * @param avoidNewsletter
 * @returns {Promise<*>}
 */
exports.sendWelcomeUser = async (to, user, avoidNewsletter) => {

    if (!avoidNewsletter)
        await addContact(user);

    return await sendTemplateEmail(to, `Welcome to ${config.name}`, 'welcomeUser', {
        appName: config.name,
        firstName: user.firstName
    });
}

/**
 * Send a welcome email to new subs to our newsletter
 * @param to
 * @returns {Promise<*>}
 */
exports.sendSubscriptionWelcomeEmail = async (to, user) => {

    return await sendTemplateEmail(to, "You're on the List", "welcomeToNewsLetter", {
        appName: config.name,
        firstName: user.firstName
    });
}

exports.sendForgotPassword = async (to, user, recoveryHash) => {

    const cs = config.server;
    const recoveryUrl = cs.address + ':' + (cs.useSSL ? cs.port : cs.httpsPort)
        + '/auth/change-password/' + recoveryHash

    return await sendTemplateEmail(to, "Did you forget your password?", "forgotPassword", {
        appName: config.name,
        firstName: user.firstName,
        recoveryUrl
    });
}


