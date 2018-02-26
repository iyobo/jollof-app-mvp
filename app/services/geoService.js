const jollof = require('jollof');
const got = require('got');

/**
 * If you ever need to derive the locatio of a visitor's IP address,
 * check out freeGeoIP. Here's a helper function to help you with that.
 *
 * @param ip
 * @returns {Promise<any>}
 */
exports.deriveGeoFromIp = async (ip) => {
    //if (ctx.session.geo) {
    const locResp = await got(jollof.config.thirdParty.freeGeoIp.host + ip);
    const geo = JSON.parse(locResp.body);

    //if no geo data came through, fill with default and specify as mock
    if (!geo.city) {
        geo.city = '';
        geo.region_code = '';
        geo.region_name = '';
        geo.country_name = '';
        geo.isMock = true;
    }

    return geo;
};