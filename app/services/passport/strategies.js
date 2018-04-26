const jollof = require('jollof');
const config = jollof.config;
const sendWelcomeUserEmail = require('../mailService').sendWelcomeUser;
const User = jollof.models.User;
const UserIdentity = jollof.models.UserIdentity;
const crypto = jollof.crypto;

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

const serverConfig = jollof.config.server;
const hostAddress = `${serverConfig.useSSL ? 'https' : 'http'}://${serverConfig.host}:${serverConfig.useSSL ? serverConfig.httpsPort : serverConfig.port}`;


/**
 * This function is called from internal jollof. It sets up the app with Authentication strategies.
 * Jollof comes with Passport, though you could effectually ignore passport and end up using whatever you want.
 *
 * Passport is an express plugin with over 300 different authentication strategies! It might look unwieldy due to
 * the fact that it was built with legacy ES5 in mine, but it's well worth it to understand it and build apps with
 * unlimited connectivity!
 *
 * Users today expect to login to your app with Google, Facebook, Twitter, etc and will easily move on if
 * you do not provide the options to.
 *
 * This App scaffold makes it easy. Just get the keys from these social sites and replace them in configs.
 *
 * @param passport - the passport instance
 */
exports.setupStrategies = (app, passport) => {
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (err) {
            done(err)
        }
    })

    /**
     * The Passport Local Strategy covers checking username and password against a datasource.
     */
    const LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(async function (username, password, done) {

        // This user object uses Email as username.
        try {
            const user = await User.findOneBy({ email: username });
            const identity = await UserIdentity.findOneBy({ identityEmail: username, source: 'local' });

            if (user && await crypto.compare(password, identity.password)) {
                done(null, user)

            } else {
                done(null, null)
            }
        } catch (err) {
            done(err)
        }

    }));


    /**
     * Here are some other strategies you can activate.
     */
    passport.use(new FacebookStrategy({
            clientID: config.passport.facebook.clientID,
            clientSecret: config.passport.facebook.clientSecret,
            callbackURL: `${hostAddress}/auth/facebook/callback`,
            profileFields: ['id', 'email', 'name']
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                authenticate('facebook', accessToken, profile, done);
            } catch (err) {
                done(err);
            }
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: config.passport.google.clientID,
            clientSecret: config.passport.google.clientSecret,
            callbackURL: `${hostAddress}/auth/google/callback`,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                authenticate('google', accessToken, profile, done);
            } catch (err) {
                done(err);
            }

        }
    ));

    passport.use(new InstagramStrategy({
            clientID: config.passport.instagram.clientID,
            clientSecret: config.passport.instagram.clientSecret,
            callbackURL: `${hostAddress}/auth/instagram/callback`,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                authenticate('instagram', accessToken, profile, done);
            } catch (err) {
                done(err);
            }

        }
    ));

};


async function authenticate(provider, accessToken, profile, done) {
    const userEmail = profile.emails[0].value;

    //Search for Facebook user identity
    const userIdentity = await UserIdentity.findOneBy({
        identityEmail: userEmail,
        source: provider
    });

    if (userIdentity) {
        await jollof.models.UserIdentity.updateBy({ id: `${userIdentity.id}` }, { accessToken });

        const user = await jollof.models.User.findById(userIdentity.user);

        done(null, user);
    } else {
        const user = await jollof.models.User.findOneBy({ email: userEmail });
        if (user) {
            const userIdentityEntry = new jollof.models.UserIdentity({
                identityEmail: userEmail,
                source: provider,
                user: `${user.id}`,
                identityKey: profile.id,
            });

            const newUserIdentity = await userIdentityEntry.save();
            done(null, user);
        } else {
            //Create user
            const userEntry = new jollof.models.User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: userEmail,
                isAdmin: false,
                password: profile.id,
            });
            const newUser = await userEntry.save();

            //Create User Identity
            const userIdentityEntry = new jollof.models.UserIdentity({
                identityEmail: userEmail,
                source: provider,
                user: `${newUser.id}`,
                identityKey: profile.id,
                accessToken: profile.accessToken || '',
            });

            const newUserIdentity = await userIdentityEntry.save();

            //notify
            await sendWelcomeUserEmail({ to: newUser.email, newUser })

            done(null, newUser);
        }
    }
}