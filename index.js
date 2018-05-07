require('moment').locale();
require('dotenv').config();



const jollof = require('jollof');
const passport = require('koa-passport');
const convert = require('koa-convert');
var createServer = require("auto-sni");
var gzip = require('koa-gzip');


const useSSL = jollof.config.server.useSSL;
console.log('useSSL: ',useSSL);

(async () => {

    //SPICES are no longer supported
    //await require('jollof-spice-blog')(jollof);


    const server = await jollof.bootstrap.bootServer(function* (koaApp) {

        //add overrides / things to add to koa app before it gets launched

        /**
         * From this point, you are working with KoaJS.
         * Add overrides to the koa instance jollofJS will run on.
         * You could implement any plugin supported by Koa here.
         */

        koaApp.proxy = true;

        /**
         * Setup custom Auth. This scaffold app wires together a quick passport auth framework for you.
         * However, JollofJS is not dependent on any of these and you can rip it out and use whatever
         * authentication/authorization wiring you need for your app.
         */
        koaApp.use(passport.initialize());
        koaApp.use(passport.session());
        koaApp.use(convert(function* (next) {
            this.passport = passport;
            this.state.originalUrl = this.request.originalUrl;
            return yield next;
        }));
        koaApp.use(gzip());


        //Setup passport auth strategies
        require('./app/services/passport/strategies').setupStrategies(koaApp, passport);


        //Let's encrypt SSL
        if(useSSL) {
            createServer({
                email: jollof.config.mail.from,
                domains: jollof.config.server.domains,
                agreeTos: jollof.config.thirdParty.letsEncrypt.iAgreeToTOS,
                ports: {
                    http: jollof.config.server.port,
                    https: jollof.config.server.httpsPort
                },
            }, koaApp.callback());
        }

    }, useSSL);

    console.log(`\n${require('figlet').textSync('JollofJS')} \n ><><><><><><><><><><><><><><><><><><><`);
    console.log('App:',jollof.config.server.addressString)

})();
