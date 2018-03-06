/**
 * Created by iyobo on 2017-01-10.
 */
/**
 * Created by iyobo on 2016-09-18.
 */
const jollof = require('jollof');
const data = jollof.data;
const types = data.types;

//Models use names
const schema = {
    name: 'User',
    dataSource: 'default',
    structure: {
        firstName: String,
        lastName: String,
        name: { type: String, meta: { disableEdit: true } },
        email: types.Email(),
        phone: String,
        isAdmin: Boolean

    },
    hooks: {
        preSave: async function () {

            //refresh name
            this.name = this.firstName + ' ' + this.lastName;

            return true;
        },

    },
    /**
     * Methods extend a model's instance, allowing you to
     * carry out actions on the instantiated model using *this*, where *this* is the model's content.
     */
    methods: {
        async sayName(params) {
            console.log('My name is', this.name);

        }

    },
    /**
     * statics extend a model's class
     */
    statics: {

        /**
         * Does a user with this email exist?
         * @param email
         * @param selfAllowed - if true, will return true only if more than one email match is found
         * @returns {Promise.<void>}
         */
        async exists(email) {
            // const count = await jollof.models.User.count(jql`email=${email}`);
            const count = await jollof.models.User.count([['email', '=', email]]);

            if (count === 0)
                return false;
            else
                return true;
        }

    },
    /**
     * Natives functions extend adapters and can be used to access the full power of this model's raw datasource.
     * Accesed with e.g User.native.pityFoo({foo: 'bar'}).
     *
     * The init native function of a model will always be ran automatically after the model's adapter finishes initialization.
     * This is generally where you want to set indexes.
     */
    native: {
        mongodb: {
            async init() {
                await this.db.collection('User').createIndex({ email: 1 }, { unique: true });
            },
        },
        arangodb: {
            async init() {

            },
        }

    }

}


module.exports = data.registerModel(schema);