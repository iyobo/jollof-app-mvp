const config = require('jollof').config;

exports.index = async (ctx) => {

    //For now, just default to user dashboard
    ctx.state.bundleType = config.env==='development'?'dev':'prod';
    await ctx.render('dashboard/dashboard');
}
