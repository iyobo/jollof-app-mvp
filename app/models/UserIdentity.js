/**
 * Created by Tobi Kehinde on 2018-01-20.
 */

const jollof = require('jollof');
const data = jollof.data;
const types = data.types;

const schema = {
    name: 'UserIdentity',
    dataSource: 'default',
    structure: {
        user: types.Ref({ meta: { ref: 'User' } }),
        source: {
            type: String,
            meta: {
                choices: [
                    'local',
                    'facebook',
                    'google',
                ]
            }
        },
        identityEmail: String,
        password: { type: String, meta: { widget: 'password' } },
        identityKey: String,
        accessToken: String
    },
    hooks: {
        preSave: async function () {

            // handle password re-hashing if the password field changes for local sourced identities
            if(this.source==='local') {

                if (!this.isPersisted() || this._originalData.password != this.password) {
                    this.password = await jollof.crypto.hash(this.password);
                }
            }
            return true;
        }
    },

    native: {
        mongodb: {
            async init() {
                await this.db.collection('UserIdentity').createIndex({ source: 1, identityEmail: 1 }, { unique: true });
            }
        },
        arangodb: {
            async init() {
                await this.db.collection('UserIdentity').createSkipList(['source', 'identityEmail'],{ unique: true });
            },
        }
    }
};

module.exports = data.registerModel(schema);
