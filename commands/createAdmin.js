/**
 * Created by iyobo on 2017-05-21.
 */
const jollof = require('jollof');


/**
 * Receives email and password
 * @param args
 * @param args._  - an array of un-keyed arguments
 * @param args._[0]  - email
 * @param args._[1]  - password
 */
module.exports = (args) => {

    if (args._.length < 2) {
        throw new Error('Must have 2 arguments for email and password. i.e jollof run createAdmin foo@bar.com foopass')
    }

    jollof.bootstrap.boot(async function () {

        const adminUser = await jollof.models.User.persist({
            firstName: 'Jollof',
            lastName: 'Admin',
            email: args._[0],
            isAdmin: true
        });

        await jollof.models.UserIdentity.persist({
            user: adminUser.id,
            source: 'local',
            identityEmail: adminUser.email,
            identityKey: adminUser.email,
            accessToken: args._[1]
        })

        console.log('Admin user created:', adminUser.email);

        process.exit(0);
    });

}
