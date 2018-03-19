const boom = require('boom');
const jollof = require('jollof');
const sendWelcomeUserEmail = require('../services/mailService').sendWelcomeUserEmail;

exports.getCurrentUser = async (ctx) => {

    const user = ctx.state.user;

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
        await sendWelcomeUserEmail({ to: user.email, user })
    }catch(err){
        console.error('issue with sending welcome email')
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


