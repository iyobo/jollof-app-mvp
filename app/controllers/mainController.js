const jollof = require('jollof');

exports.index = async (ctx) => {

    await ctx.render('index');
};

exports.privacyPolicy = async (ctx) => {
    await ctx.render('privacyPolicy');
};

exports.termsOfUse = async (ctx) => {

    await ctx.render('termsOfUse');
};
