const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AUUeXZofRqKCwqOtpyho6v1FrQI8XrqGJC5qUWjIZex4lz3AtcPb87kmxImZ62n20ug_1Va8HhgSBbNu',
    'client_secret': 'ELENBN5UMR3IsJLXCPYMmASxVE6KN49GA_IbV8r8lftGNYwhPkoAoFH05zNTEA7tlnQVHEZ8KZemODbi',
    'headers': {
        'custom': 'header'
    }
});

module.exports = paypal;