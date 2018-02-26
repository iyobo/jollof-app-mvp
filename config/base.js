/**
 * Created by iyobo on 2016-11-07.
 */

var auth = require('../app/constraints/auth.js');

module.exports = {

    env: 'development',

    server: {
        host: 'localhost',
        port: 3001,
        httpsPort: 3002,
        address: 'http://localhost:3001',
    },

    /**
     * Jollof Data configs
     */
    data: {
        dataSources: {
            default: {
                adapter: require('jollof-data-mongodb'),
                nativeType: 'mongodb',
                options: {
                    mongoUrl: 'mongodb://localhost/jollofmvp'
                }
            }
        }
    },

    /**
     * Jollof session configurations.
     */
    sessions: {
        key: 'jollof:sess', /** (string) cookie key (default is koa:sess) */
        maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */

        /**
         * see https://www.npmjs.com/package/redis#options-is-an-object-with-the-following-possible-properties
         * Also, only using redis directly for sessions, not as a model engine, so no model adapter needed.
         */
        redis: {
            host: "localhost",
            port: 6379,
            db: 0
        },
    },

    /**
     * This web app comes with the admin UI enabled.
     */
    admin: {
        enabled: true,
        auth: auth.canViewAdmin,
        logoutPath: '/logout'
    },

    nunjucks: {
        nunjucksConfig: {
            //see https://mozilla.github.io/nunjucks/api.html#configure
            noCache: true, //do not cache nunjucks views for development
        },
    },

    /**
     * This web app comes with Mailjet configured.
     * Mailjet is an awesome mailing api that makes email communication simply.
     * You can help support JollofJS by using our referral link to Create a new Mailjet account:
     * http://mailjet.com
     */
    mail: {
        from: 'hello@jollofuser.com', // replace with from email
        fromName: "Jollof User", //replace with from email name

        mailjet: {
            key: '*MY MAILJET KEY*', //replace
            secret: '*MY SECRET KEY*' //replace
        }
    },

    /**
     * Jollof spices are mountable apps.
     * This is where you put all spice-centric config.
     */
    spices: {
        blog: {
            title: 'The Journey so Far',
            subTitle: 'Powered by JollofJS',

            auth: auth.loggedIn,
            mountPath: '/blog',

            facebookUrl: '',
            twitterUrl: '',
            githubUrl: '',
            linkedInUrl: '',
        }
    },

    /**
     * Place to put your own app-specific configs
     */
    app: {
        freeGeoIpHost: "http://freegeoip.net/json/" //+ip
    },

    /**
     * Place to put 3rd party configs
     */
    thirdParty: {
        google: {
            maps: {
                apiKey: '***',
                embedApiKey: '***'
            },
        },
    },

    /**
     * OAuth and other passport related stuff
     */
    passport: {
        facebook: {
            clientID: 'abc',
            clientSecret: 'abcd',
        },
        google: {
            clientID: 'abc',
            clientSecret: 'abcd',
        },
        instagram: {
            clientID: 'abc',
            clientSecret: 'abcd',
        }
    }
}

