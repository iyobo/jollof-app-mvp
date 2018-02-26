const jollof = require('jollof');
const mailConfig = jollof.config.mail;
const moment = require('moment');
const _ = require('lodash');
const mailjet = require('node-mailjet').connect(mailConfig.mailjet.key, mailConfig.mailjet.secret)


function formatRecipients(to, name) {
    return Array.isArray(to) ? to.map((address) => {
        return { Email: address }
    }) : [{ Email: to }]
}

/**
 *
 * @param to - list of email adresses to sed to
 * @param subject
 * @param content - html content to send
 * @returns {Promise<void>}
 */
exports.sendEmail = async ({ to, subject, content }) => {

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
const sendTemplateEmail = exports.sendTemplateEmail = async ({ to, templateId, variables = {} }) => {

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
 * @type {function({user: *, sendWelcome?: bool})}
 */
const addContact = exports.addContact = async ({ user, sendWelcome }) => {

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

/**
 * Yay! We got a new user.
 * Let's also add them to the FaaJii newsletter with their consent!
 *
 * @param to
 * @param user
 * @param avoidNewsletter
 * @returns {Promise<*>}
 */
exports.sendWelcomeUserEmail = async ({ to, user, avoidNewsletter }) => {

    if (!avoidNewsletter)
        await addContact({ user });
    return await sendTemplateEmail({ to, templateId: 999, variables: user }); //replace templateId with welcome user template created on mailjet
}

/**
 * Send a welcome email to new subs to our newsletter
 * @param to
 * @returns {Promise<*>}
 */
exports.sendSubscriptionWelcomeEmail = async ({ to }) => {

    return await sendTemplateEmail({ to, templateId: 999 }); //replace templateId with the id of correct template in your mailjet account
}




