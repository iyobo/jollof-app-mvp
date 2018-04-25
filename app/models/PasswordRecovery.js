/**
 * Created by Tobi Kehinde on 2018-01-20.
 */

const jollof = require('jollof');
const hasher = require('highwayhash');
const chance = require('chance');
const data = jollof.data;
const types = data.types;

const schema = {
    name: 'PasswordRecovery',
    dataSource: 'default',
    structure: {
        user: types.Ref({ required: true, meta: { ref: 'User' } }),
        email: { type: String, required: true },
        recoveryHash: { type: String, meta: { disableEdit: true } }
    },

    native: {
        mongodb: {
            async init() {
                await this.db.collection('PasswordRecovery').createIndex({ recoveryHash: 1 }, { unique: true });
            }
        },
        arangodb: {
            async init() {

            },
        }
    },

    hooks: {
        async preCreate() {
            if (!this.recoveryHash || this.recoveryHash === '') { //reundant check as pre-create only happens upon create
                this.recoveryHash = chance.string({ length: 13 });
            }
        }
    }
};

module.exports = data.registerModel(schema);
