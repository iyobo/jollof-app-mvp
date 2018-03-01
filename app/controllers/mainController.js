const jollof = require('jollof');

exports.index = async (ctx) => {

    await ctx.render('main/index');
};

exports.privacyPolicy = async (ctx) => {
    await ctx.render('main/privacyPolicy');
};

exports.termsOfUse = async (ctx) => {

    await ctx.render('main/termsOfUse');
};

exports.howItWorks = async (ctx) => {

    await ctx.render('main/howItWorks');
};

exports.pricing = async (ctx) => {

    await ctx.render('main/pricing');
};