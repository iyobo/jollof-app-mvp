const main = require('../app/controllers/mainController');
const auth = require('../app/controllers/authController');
const authConstraint = require('../app/constraints/auth');
const dashboard = require('../app/controllers/dashboardController');
const organizer = require('../controllers/organizerApi');
const generic = require('../app/controllers/genericApi');
const personal = require('../controllers/personalApi');
const event = require('../controllers/eventApi');
const payout = require('../controllers/payoutsController');
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

    //Social media - facebook
    'get /auth/facebook': { flow: auth.authFacebook },
    'get /auth/facebook/callback': { flow: auth.authFacebookCallback },

    //Social media - google
    'get /auth/google': { flow: auth.authGoogle },
    'get /auth/google/callback': { flow: auth.authGoogleCallback },

    //Social media - instagram
    'get /auth/instagram': { flow: auth.authInstagram },
    'get /auth/instagram/callback': { flow: auth.authInstagramCallback },

    'post /subscribe': { flow: main.subscribeToNews },

    '/calendar': { flow: main.calendar },
    '/map': { flow: main.map },

    '/api/getEvents': { flow: main.getEvents },

    //view pages
    '/event/:id': { flow: main.event },
    '/organizer/:id': { flow: main.organizer },

    //Purchase event tickets
    'get /event/:id/purchase': { flow: main.purchaseEventTicket },
    'post /paynow': { flow: main.payNow },
    'get /execute-payment': { flow: main.executePayment },
    'get /cancel-payment': { flow: main.cancelPayment },

    //dashboard. Can only see it when logged in
    '/dashboard': { flow: [authConstraint.loggedIn, dashboard.index] },

    //Override Organizer API endpoints with custom implementations beyond the generic
    'get /api/v1/is-organizer': { flow: [authConstraint.loggedIn, organizer.isOrganizer] },
    'get /api/v1/organizer/stats': { flow: [authConstraint.loggedIn, organizer.getStats] },

    //Events
    'get /api/v1/organizer/event': { flow: [authConstraint.loggedIn, event.getEvents] },
    'get /api/v1/organizer/events-indirect': { flow: [authConstraint.loggedIn, event.getIndirectEvents] },
    'post /api/v1/organizer/event': { flow: [authConstraint.loggedIn, event.upsertEvent] },
    'get /api/v1/organizer/event/:id/dashboard': { flow: [authConstraint.loggedIn, event.getEventDashboard] },
    'get /api/v1/organizer/event/:id/create': { flow: [authConstraint.loggedIn, event.createEvent] },
    'patch /api/v1/organizer/event/:id/shares': { flow: [authConstraint.loggedIn, event.setEventProfitShares] },
    'post /api/v1/organizer/event/:id/close': { flow: [authConstraint.loggedIn, event.closeEvent] },
    'put /api/v1/organizer/event/:id/publish': { flow: [authConstraint.loggedIn, event.togglePublishEvent] },

    // Tickets
    'get /api/v1/event/:id/tickets': { flow: [authConstraint.loggedIn, event.getEventTickets] },
    'post /api/v1/event/:id/tickets': { flow: [authConstraint.loggedIn, event.upsertTickets] },

    //Expenses
    'patch /api/v1/organizer/expense/:id/pay': { flow: [authConstraint.loggedIn, organizer.payExpense] },
    'put /api/v1/organizer/expense/pay': { flow: [authConstraint.loggedIn, organizer.payMultipleExpenses] },
    'patch /api/v1/organizer/expense/:id/unpay': { flow: [authConstraint.loggedIn, organizer.unpayExternalExpense] },

    //Users
    'get /api/v1/organizer/user': { flow: [authConstraint.loggedIn, organizer.findUser] },

    // Accounts
    'put /api/v1/organizer/user/account': { flow: [authConstraint.loggedIn, organizer.createAccount] },
    'put /api/v1/organizer/user/paypal': { flow: [authConstraint.loggedIn, organizer.setPayPalEmail] },
    'get /api/organizer/user/account': { flow: [authConstraint.loggedIn, organizer.getPaymentAccount] },

    //Personal API
    'get /api/v1/me': { flow: [authConstraint.loggedIn, personal.getCurrentUser] },
    'get /api/v1/my/ticket': { flow: [authConstraint.loggedIn, personal.getTickets] },
    'get /api/v1/my/ticket/:id': { flow: [authConstraint.loggedIn, personal.getTicket] },

    //Payouts API
    'post /api/v1/events/:event_id/paypal-payouts': { flow: [authConstraint.loggedIn, payout.createPaypalPayout] },
    'post /api/v1/events/:event_id/stripe-payouts': { flow: [authConstraint.loggedIn, payout.createStripePayout] },

    //Support
    'get /privacy-policy': { flow: main.privacyPolicy },
    'get /terms-of-use': { flow: main.termsOfUse },
    'get /pricing': { flow: main.termsOfUse },
});


module.exports = routes;