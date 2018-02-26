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
        identityKey: String,
        accessToken: { type: String, meta: { widget: 'password' } },
    },
    hooks: {
        preSave: async function () {

            // handle password re-hashing if the password field changes for local sourced identities
            if(this.source==='local') {
                let originalIdentity;
                if (this.isPersisted()) {
                    originalIdentity = await jollof.models.UserIdentity.findBy({ user: this.id });
                }

                if (!originalIdentity || originalIdentity.accessToken != this.accessToken) {
                    this.accessToken = await jollof.crypto.hash(this.accessToken);
                }
            }
            return true;
        }
    },

    native: {
        mongodb: {
            async init() {
            }
        }
    }
};

module.exports = data.registerModel(schema);
