const _ = require('lodash');

/**
 * Given a jollof location field, flattens it to an address string line.
 * @param loc
 * @returns {string}
 */
exports.flattenGeo = (loc) => {

    return `${loc.address?loc.address+', ':''}${loc.city?loc.city+', ':''}${loc.state?loc.state+', ':''}${loc.postalCode?loc.postalCode+', ':''}${loc.country?loc.country:''}`
}
