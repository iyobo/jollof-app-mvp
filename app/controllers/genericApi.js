/**
 * Used for basic REST endpoints
 */

const jollof = require('jollof');
const Boom = require('boom');
const sendWelcomeUserEmail = require('../services/actions/email/userEmailActions').sendWelcomeUser;


exports.getItems = async (modelName, ctx) => {

    ctx.body = await jollof.models[modelName].find([])
};

exports.getItem = async (modelName, ctx) => {

    const id = ctx.params.id;

    ctx.body = await jollof.models[modelName].findById(id)
};

exports.createItem = async (modelName, ctx) => {

    const payload = ctx.request.fields;

    console.log({payload})

    if(!payload) throw new Boom.badData('Payload is Empty')

    const newItem = new jollof.models[modelName](payload);

    ctx.body = await newItem.save()
}

exports.updateItem = async (modelName, ctx) => {

    const id = ctx.params.id;
    const payload = ctx.request.fields;

    console.log({payload})

    ctx.body = await jollof.models[modelName].updateBy({ id }, payload);

};

exports.deleteItem = async (modelName, ctx) => {

    const id = ctx.params.id;

    ctx.body = await jollof.models[modelName].removeBy({ id });

};
