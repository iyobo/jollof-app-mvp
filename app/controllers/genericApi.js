/**
 * Used for basic REST endpoints
 */

const jollof = require('jollof');
const Boom = require('boom');
const sendWelcomeUserEmail = require('../services/mailService').sendWelcomeUserEmail;


exports.getItems = async (modelName, ctx) => {

    const user = ctx.state.user;

    ctx.body = await jollof.models[modelName].findBy({ organizer: user.id })
};

exports.getItem = async (modelName, ctx) => {

    const user = ctx.state.user;
    const id = ctx.params.id;

    ctx.body = await jollof.models[modelName].findById(id)
};

exports.createItem = async (modelName, ctx) => {

    const user = ctx.state.user;
    const payload = ctx.request.fields;

    console.log({payload})

    if(!payload) throw new Boom.badData('Payload is Empty')

    const newItem = new jollof.models[modelName](payload);

    ctx.body = await newItem.save()
}

exports.updateItem = async (modelName, ctx) => {

    const user = ctx.state.user;
    const id = ctx.params.id;
    const payload = ctx.request.fields;

    console.log({payload})

    ctx.body = await jollof.models[modelName].updateBy({ id }, payload);

};

exports.deleteItem = async (modelName, ctx) => {

    const user = ctx.state.user;
    const id = ctx.params.id;

    ctx.body = await jollof.models[modelName].removeBy({ id });

};
