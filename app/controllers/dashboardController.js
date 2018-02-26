
exports.index = async (ctx) => {

    //For now, just default to user dashboard
    await ctx.render('dashboard/dashboard');
}
