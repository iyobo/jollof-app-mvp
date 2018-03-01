const _ = require('lodash');
const generic = require('../controllers/genericApi');

function loadArray(inputMap, key) {
    let resultArray = []
    const val = inputMap[key];
    if (val) {
        if (Array.isArray(val)) {
            resultArray = val;
        } else {
            resultArray = [val]
        }
    }
    return resultArray;
}

/**
 * a function to create resource routes from models. api
 * @param routeMap - the route map
 * @param prePath
 * @param version
 * @param modelName
 * @param restConstraints - {all, getOne, get, create, update, delete} - an keyed map of constraint arrays
 */
exports.buildGenericResourceAPI = function (routeMap, { prePath, modelName, restConstraints = {} }) {

    const apiRoutes = {};

    const lowerCaseName = modelName.toLowerCase();

    let baseLineConstraints = loadArray(restConstraints, 'all');

    const flows = {
        getOne: baseLineConstraints.concat(loadArray(restConstraints, 'getOne'), generic.getItem.bind(modelName, modelName)),
        get: baseLineConstraints.concat(loadArray(restConstraints, 'get'), generic.getItems.bind(modelName, modelName)),
        create: baseLineConstraints.concat(loadArray(restConstraints, 'create'), generic.createItem.bind(modelName, modelName)),
        update: baseLineConstraints.concat(loadArray(restConstraints, 'update'), generic.updateItem.bind(modelName, modelName)),
        delete: baseLineConstraints.concat(loadArray(restConstraints, 'delete'), generic.deleteItem.bind(modelName, modelName)),
    }

    apiRoutes[`get /api/${prePath ? prePath + '/' : ''}${lowerCaseName}/:id`] = { flow: flows.getOne }
    apiRoutes[`get /api/${prePath ? prePath + '/' : ''}${lowerCaseName}`] = { flow: flows.get }
    apiRoutes[`post /api/${prePath ? prePath + '/' : ''}${lowerCaseName}`] = { flow: flows.create }
    apiRoutes[`patch /api/${prePath ? prePath + '/' : ''}${lowerCaseName}/:id`] = { flow: flows.update }
    apiRoutes[`delete /api/${prePath ? prePath + '/' : ''}${lowerCaseName}/:id`] = { flow: flows.delete }

    //append to routeMap
    _.each(apiRoutes, (v, k) => {
        routeMap[k] = v;
    });
}