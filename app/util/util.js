const _ = require('lodash');

/**
 * Given a jollof location field, flattens it to an address string line.
 * @param loc
 * @returns {string}
 */
exports.flattenGeo = (loc) => {

    return `${loc.address?loc.address+', ':''}${loc.city?loc.city+', ':''}${loc.state?loc.state+', ':''}${loc.postalCode?loc.postalCode+', ':''}${loc.country?loc.country:''}`
}

/**
 * If you'd want to, Run this to hijack give more meaning to console.log and console.err
 */
exports.hijackConsole= ()=>{
    var origlog = console.log;

    console.log = function( obj, ...placeholders ){
        if ( typeof obj === 'string' )
            placeholders.unshift( new Date() + " >> " + obj );
        else
        {
            // This handles console.log( object )
            placeholders.unshift( obj );
            placeholders.unshift( Date.now() + " %j" );
        }

        origlog.apply( this, placeholders );
    };

    var origerr = console.err;

    console.err = function( obj, ...placeholders ){
        if ( typeof obj === 'string' )
            placeholders.unshift( new Date() + " >> " + obj );
        else
        {
            // This handles console.log( object )
            placeholders.unshift( obj );
            placeholders.unshift( Date.now() + " %j" );
        }

        origerr.apply( this, placeholders );
    };
}