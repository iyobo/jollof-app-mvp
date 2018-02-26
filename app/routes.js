const main = require('../app/controllers/mainController');
const auth = require('../app/controllers/authController');
const authConstraint = require('../app/constraints/auth');
const generic = require('../app/controllers/genericApi');

const _ = require('lodash');

function buildGenericResourceAPI(routeMap, { prePath, modelName }) {

    const apiRoutes = {};

    const lowerCaseName = modelName.toLowerCase();

    apiRoutes[`get /api/v1/${prePath ? prePath + '/' : ''}${lowerCaseName}`] = { flow: [authConstraint.loggedIn, generic.getItems.bind(modelName, modelName)] },
        apiRoutes[`get /api/v1/${prePath ? prePath + '/' : ''}${lowerCaseName}/:id`] = { flow: [authConstraint.loggedIn, generic.getItem.bind(modelName, modelName)] },
        apiRoutes[`post /api/v1/${prePath ? prePath + '/' : ''}${lowerCaseName}`] = { flow: [authConstraint.loggedIn, generic.createItem.bind(modelName, modelName)] },
        apiRoutes[`patch /api/v1/${prePath ? prePath + '/' : ''}${lowerCaseName}/:id`] = { flow: [authConstraint.loggedIn, generic.updateItem.bind(modelName, modelName)] },
        apiRoutes[`delete /api/v1/${prePath ? prePath + '/' : ''}${lowerCaseName}/:id`] = { flow: [authConstraint.loggedIn, generic.deleteItem.bind(modelName, modelName)] },

        //append to routeMap
        _.each(apiRoutes, (v, k) => {
            routeMap[k] = v;
        });
}


let routes = {};

buildGenericResourceAPI(routes, { prePath: 'organizer', modelName: 'Event' });
buildGenericResourceAPI(routes, { prePath: 'organizer', modelName: 'Expense' });
buildGenericResourceAPI(routes, { prePath: 'organizer', modelName: 'Ticket' });
buildGenericResourceAPI(routes, { prePath: 'organizer', modelName: 'Investment' });
buildGenericResourceAPI(routes, { prePath: 'organizer', modelName: 'Payee' });

routes = _.merge(routes, {
    '/': { flow: main.index },
    'post /login': { flow: auth.doLogin },
    '/login': { flow: auth.login },
    '/signup': { flow: auth.signup },
    'post /signup': { flow: auth.doSignup },
    'get /logout': { flow: auth.logout },

    //Support
    'get /privacy-policy': { flow: main.privacyPolicy },
    'get /terms-of-use': { flow: main.termsOfUse },
});


module.exports = routes;