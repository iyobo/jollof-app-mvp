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
    name: 'Rice',
    dataSource: 'default',
    structure: {
        name: String,
        notes: { type: String, meta: { widget: 'textarea' } },
        category: {
            type: String, meta: {
                choices: ['Healthy', 'Not Healthy'],
            }
        },
        pic: types.File(),
        bestEatenWith: types.Ref({ meta: { ref: 'Spoon' } })
    }
}


module.exports = data.registerModel(schema);