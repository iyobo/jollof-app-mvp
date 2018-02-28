const _ = require('lodash');
const main = require('../app/controllers/mainController');
const auth = require('../app/controllers/authController');
const buildGenericResourceAPI = require('./util/routeUtil').buildGenericResourceAPI;

/**
 * Use this to build routes for any model you intend to make a resource
 */
const resourceRoutes = {};
//buildGenericResourceAPI(resourceRoutes, { prePath: 'v1', modelName: 'SomeModel' });

/**
 * Put your app-specific routes here
 */
const appRoutes = {
    '/': { flow: main.index },
    'post /login': { flow: auth.doLogin },
    '/login': { flow: auth.login },
    '/signup': { flow: auth.signup },
    'post /signup': { flow: auth.doSignup },
    'get /logout': { flow: auth.logout },

    //Support
    'get /privacy-policy': { flow: main.privacyPolicy },
    'get /terms-of-use': { flow: main.termsOfUse },
};


/**
 * At the end of the day, you can do all of the above in other files.
 * But just make sure app/routes.js exports your entire route map for your app.
 */
module.exports = _.merge(resourceRoutes, appRoutes);;