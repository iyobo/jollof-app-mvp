const boom = require('boom');
const jollof = require('jollof');
const sendWelcomeUserEmail = require('../services/mailService').sendWelcomeUserEmail;

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
        ctx.body = {success: true};
        ctx.login(authenticatedUser);

    } else {
        return ctx.throw(new boom.notFound('Invalid Credentials'));
    }


};

exports.doSignup = async (ctx) => {

    const User = jollof.models.User;
    const email = ctx.request.fields.email;

    //first check if user exists
    if ((await User.exists(email)) === true) {
        return ctx.throw(new boom.conflict(`User with email ${email} already exists`));
    }


    const user= await User.persist(ctx.request.fields);

    //notify
    await sendWelcomeUserEmail({to: user.email, user})

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
        await ctx.render('login');
    }

}
exports.signup = async (ctx) => {
    if (ctx.session.user) {
        await ctx.redirect('/');
    } else {
        await ctx.render('signup');
    }
}


/**
 * Other potential auth endpoints
 */
exports.authFacebook = async (ctx) => {
    ctx.passport.authenticate('facebook', {scope: ['email']})(ctx);
};

exports.authFacebookCallback = async (ctx) => {
    await ctx.passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(ctx);
};

exports.authGoogle = async (ctx) => {
    ctx.passport.authenticate('google', { scope: [ 'profile', 'email' ] })(ctx);
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


