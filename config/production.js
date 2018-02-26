/**
 * Created by iyobo on 2016-11-07.
 */

module.exports = {

    /**
     * Override the base here for your production environment
     */

    env: 'production',

    server: {
        host: 'mydomain.com',
        port: 80,
        httpsPort: 443,
        address: 'https://mydomain.com',
        useSSL: true,
        domains: ['mydomain.com']
    },
    nunjucks: {
        nunjucksConfig: {
            //see https://mozilla.github.io/nunjucks/api.html#configure
            noCache: false, // cache nunjucks views for prod
        },
    },

    thirdParty: {
        letsEncrypt: {
            iAgreeToTOS: false //No HTTPS for you until you read the LetsEncrypt TOS and set this to true.
        },
    }

};
