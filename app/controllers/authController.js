const boom = require('boom');
const jollof = require('jollof');
const sendPasswordChangedNotice = require('../services/actions/email/userEmailActions').sendPasswordChangedNotice;
const sendForgotPassword = require('../services/actions/email/userEmailActions').sendForgotPassword;
const sendWelcomeUserEmail = require('../services/actions/email/userEmailActions').sendWelcomeUser;

exports.getCurrentUser = async (ctx) => {

    const user = ctx.state.user;

    ctx.body = user;
}


exports.updateUser = async (ctx) => {

    const user = ctx.state.user;
    const fields = ctx.request.fields;

    //user is updating their profile
    user.firstName = fields.firstName;
    user.lastName = fields.lastName;
    user.email = fields.email;

    //check if a new password has been set.

    if (fields.password && fields.password !== '') {
        // If so, a local UserIdentity must be created if one doesn't yet exist, and that password must be set to the incoming password

        const UserIdentity = jollof.models.UserIdentity;
        const ui = await UserIdentity.findOneBy({ source: 'local', identityEmail: fields.email });

        if (ui) {
            ui.password = fields.password;
            await ui.save()
        }
        else {
            await UserIdentity.persist({
                identityEmail: fields.email,
                password: fields.password,
                source: 'local'
            })
        }
    }

    await user.save();
    ctx.body = user;
}

exports.doLogin = async (ctx) => {

    //Authenticate using the local strategy defined in app/service/passport/strategy
    //See there for other strategies.
    const authenticatedUser = await new Promise((resolve, reject) => {
        ctx.passport.authenticate('local', function (err, user) {

            if (err) {
                reject(err);
            }

            resolve(user);
        })(ctx);
    });

    if (authenticatedUser) {
        ctx.body = { success: true, destination: ctx.session.destination };
        ctx.login(authenticatedUser);

    } else {
        return ctx.throw(new boom.notFound('Invalid Credentials'));
    }

};

exports.doSignup = async (ctx) => {

    const User = jollof.models.User;
    const UserIdentity = jollof.models.UserIdentity;
    const email = ctx.request.fields.email;
    const password = ctx.request.fields.password;

    let user = await User.findOneBy({ email });
    let localIdentity = await UserIdentity.findOneBy({ identityEmail: email, source: 'local' });
    //first check if user exists
    if (user || localIdentity) {
        return ctx.throw(new boom.conflict(`User with email ${email} already exists`));
    }

    user = await User.persist(ctx.request.fields);

    await UserIdentity.persist({
        user: user.id,
        source: 'local',
        identityEmail: user.email,
        password
    });

    try {
        //notify
        await sendWelcomeUserEmail(user.email, user)
    } catch (err) {
        console.error('issue with sending welcome email', err)
    }

    //Use email of new user as username
    ctx.request.fields.username = ctx.request.fields.email;


    await exports.doLogin(ctx);

}

exports.logout = async (ctx) => {
    ctx.logout()
    ctx.redirect('/')
}

exports.login = async (ctx) => {

    if (ctx.session.user) {
        await ctx.redirect('/');
    } else {
        if (ctx.query.destination)
            ctx.session.destination = ctx.query.destination;
        await ctx.render('auth/login');
    }

}

exports.signup = async (ctx) => {
    if (ctx.session.user) {
        await ctx.redirect('/');
    } else {
        await ctx.render('auth/signup');
    }
}

/**
 * Display page when user clicks on recover password..............
 * @param ctx
 * @returns {Promise<void>}
 */
exports.recoverPassword = async (ctx) => {
    await ctx.render('auth/recoverPassword');
}

/**
 * if user exists, Generates a recovery hash and send email
 * @param ctx
 * @returns {Promise<void>}
 */
exports.doRecoverPassword = async (ctx) => {
    const email = ctx.request.fields.email;

    //does user exist in system?
    const user = await jollof.models.User.findOneBy({ email });

    //if user exists, initiate password recovery protocol
    if (user) {
        const expiresOn = new Date();
        expiresOn.setHours(expiresOn.getHours() + (jollof.config.passport.resetExpiryHours || 72));
        const pr = await jollof.models.PasswordRecovery.create({ email, user: user.id, used: false, expiresOn});
        await sendForgotPassword(email, user, pr.recoveryHash);
    }

    ctx.body = 'Recovery triggered';
}

/**
 * Show page where user enters new password
 * @param ctx
 * @param ctx.params.rtok
 * @returns {Promise<void>}
 */
exports.changeRecoverPassword = async (ctx) => {
    const rtok = ctx.params.rtok;

    //recovery token must not have been used and must not be expired

    const pr = await jollof.models.PasswordRecovery.findOne([
        ['recoveryHash', '=', rtok],
        ['used', '!=', true],
        ['expiresOn','>', new Date()]
    ]);

    ctx.state.rtok = rtok;

    if (!pr) throw new boom.notFound('Invalid or expired password reset token')

    await ctx.render('auth/changeRecoverPassword');
}

/**
 * update userIdentity
 * @param ctx
 * * @param ctx.params.rtok
 * @returns {Promise<void>}
 */
exports.doChangeRecoverPassword = async (ctx) => {
    const password = ctx.request.fields.password;
    const rtok = ctx.params.rtok;

    const jm = jollof.models;
    const pr = await jollof.models.PasswordRecovery.findOne([
        ['recoveryHash', '=', rtok],
        ['used', '!=', true],
        ['expiresOn','>', new Date()]
    ]);

    if (!pr) throw new boom.notFound('Invalid or expired password reset token')

    /*
    Change password
    */

    const user = await jm.User.findById(pr.user);
    let ui = await jm.UserIdentity.findOneBy({ identityEmail: user.email, source: 'local' });

    if (user && ui) {
        ui.password = password;
        await ui.save();
    }
    else if (user && !ui) {
        ui = new jm.UserIdentity({ identityEmail: user.email, password, source: 'local', user: user.id })
        await ui.save();
    }

    //now change the pr
    pr.used = true;
    await pr.save();

    await sendPasswordChangedNotice(user.email, user);

    ctx.body = true;

}


/**
 * Other potential auth endpoints
 */
exports.authFacebook = async (ctx) => {
    ctx.passport.authenticate('facebook', { scope: ['email'] })(ctx);
};

exports.authFacebookCallback = async (ctx) => {
    await ctx.passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(ctx);
};

exports.authGoogle = async (ctx) => {
    ctx.passport.authenticate('google', { scope: ['profile', 'email'] })(ctx);
};

exports.authGoogleCallback = async (ctx) => {
    await ctx.passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(ctx);
};


exports.authInstagram = async (ctx) => {
    ctx.passport.authenticate('instagram')(ctx);
};

exports.authInstagramCallback = async (ctx) => {
    await ctx.passport.authenticate('instagram', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(ctx);
};


