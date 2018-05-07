const jollof = require('jollof');
const config = jollof.config;
const moment = require('moment');
const addContact = require('../../mailService').addContact;
const sendTemplateEmail = require('../../mailService').sendTemplateEmail;
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
        firstName: user.firstName,
        mainUrl: config.server.addressString
    });
}

exports.sendForgotPassword = async (to, user, recoveryHash) => {

    const cs = config.server;
    const recoveryUrl = cs.addressString + '/auth/change-password/' + recoveryHash;

    return await sendTemplateEmail(to, "Did you forget your password?", "forgotPassword", {
        appName: config.name,
        firstName: user.firstName,
        recoveryUrl,
        mainUrl: config.server.addressString,
        expiryHours: config.passport.resetExpiryHours || 72
    });
}

exports.sendPasswordChangedNotice = async (to, user) => {

    const cs = config.server;

    return await sendTemplateEmail(to, "Password Changed", "passwordChanged", {
        appName: config.name,
        firstName: user.firstName,
        mainUrl: config.server.addressString
    });
}