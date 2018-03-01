const _ = require('lodash');
const main = require('./controllers/mainController');
const dashboard = require('./controllers/dashboardController');
const auth = require('./controllers/authController');
const loggedIn = require('./constraints/auth').loggedIn;
const buildGenericResourceAPI = require('./util/routeUtil').buildGenericResourceAPI;

/**
 * Use this map to configure a REST API for each model you intend to make a resource
 */
const resourceRoutes = {};
buildGenericResourceAPI(resourceRoutes, {
    prePath: 'v1',
    modelName: 'Spoon',
    restConstraints: { all: [loggedIn] }
});
buildGenericResourceAPI(resourceRoutes, {
    prePath: 'v1',
    modelName: 'Rice',
    restConstraints: { all: [loggedIn] }
});

/**
 * Put your app-specific routes here
 */
const appRoutes = {
    '/': { flow: main.index },
    'get /how-it-works': { flow: main.howItWorks },
    'get /pricing': { flow: main.pricing },
    'get /privacy-policy': { flow: main.privacyPolicy },
    'get /terms-of-use': { flow: main.termsOfUse },

    //auth
    'post /login': { flow: auth.doLogin },
    '/login': { flow: auth.login },
    '/signup': { flow: auth.signup },
    'post /signup': { flow: auth.doSignup },
    'get /logout': { flow: auth.logout },
    'get /dashboard': { flow: auth.logout },

    //dashboard. Can only access it when logged in
    '/dashboard': { flow: [loggedIn, dashboard.index] },

    //Social media - facebook
    'get /auth/facebook': { flow: auth.authFacebook },
    'get /auth/facebook/callback': { flow: auth.authFacebookCallback },

    //Social media - google
    'get /auth/google': { flow: auth.authGoogle },
    'get /auth/google/callback': { flow: auth.authGoogleCallback },

    //Social media - instagram
    'get /auth/instagram': { flow: auth.authInstagram },
    'get /auth/instagram/callback': { flow: auth.authInstagramCallback },

};


/**
 * At the end of the day, you can do all of the above in other files.
 * But just make sure app/routes.js exports your entire route map for your app.
 */
module.exports = _.merge(resourceRoutes, appRoutes);
;