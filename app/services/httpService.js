const deriveGeoFromIp = require('./geoService').deriveGeoFromIp;



/**
 * Grab the visitor's geo once and store it in their active session.
 * @param ctx
 * @returns {Promise.<*>}
 */
exports.ensureGeoInSession = async (ctx) => {
    if (!ctx.session.geo) {
        ctx.session.geo = await deriveGeoFromIp(ctx.request.ip);
    }

    return ctx.session.geo;
}