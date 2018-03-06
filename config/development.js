module.exports = {

    env: 'development',

    /**
     * Override the base here for your dev environment
     */

    /**
     * Jollof Data configs
     */
    data: {
        dataSources: {
            default: {
                adapter: require('jollof-data-arangodb'),
                nativeType: 'arangodb',
                options: {
                    url: null, //use localhos and default port
                    databaseName: 'funtime',
                    username: 'root',
                    password: ''
                }
            },
            temporal: {
                adapter: require('jollof-data-arangodb'),
                nativeType: 'arangodb',
                options: {
                    url: null, //use localhos and default port
                    databaseName: 'temporal',
                    username: 'root',
                    password: ''
                }
            }
        }
    },

}

