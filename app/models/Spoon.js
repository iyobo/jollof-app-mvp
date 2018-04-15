/**
 * Created by iyobo on 2017-01-10.
 */
/**
 * Created by iyobo on 2016-09-18.
 */
const jollof = require('jollof');
const data = jollof.data;
const types = data.types;

const schema = {
    name: 'Spoon',
    dataSource: 'default',
    structure: {
        name: String,
        pic: types.File(),
        isMetal: Boolean
    }
}


module.exports = data.registerModel(schema);