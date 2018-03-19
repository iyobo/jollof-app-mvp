/**
 * Created by iyobo on 2017-05-21.
 */
const jollof = require('jollof');


/**
 * Receives email and password.
 * Creates and/or converts a user into an admin
 * @param args
 * @param args._  - an array of un-keyed arguments
 * @param args._[0]  - email
 * @param args._[1]  - password (optional)
 */
module.exports = (args) => {

    jollof.bootstrap.boot(async function () {

        const email = args._[0];
        const password = args._[1];
        const User = jollof.models.User;
        const UserIdentity = jollof.models.UserIdentity;

        let user = await User.findOneBy({email});
        let localIdentity = await UserIdentity.findOneBy({identityEmail: email, source:'local'});
        //first check if user exists

        if(user){
            user.isAdmin = true;
            await user.save();
            console.log(`User ${email} converted to admin`);
        }else{
            if (!password) {
                throw new Error('To create a user: Must have 2 arguments for email and password. i.e jollof run createAdmin foo@bar.com foopass')
            }

            user = await User.persist({
                firstName: 'Jollof',
                lastName: 'Admin',
                email,
                isAdmin: true
            });
            console.log(`Admin user ${email} created/`);
        }

        if(localIdentity){
            if(password){
                localIdentity.password = password;
                await localIdentity.save()
                console.log(`Local UserIdentity password changed for ${email}`);
            }

        }else{
            if (!password) {
                throw new Error('To create a new user ientity: Must have 2 arguments for email and password. i.e jollof run createAdmin foo@bar.com foopass')
            }

            await UserIdentity.persist({
                user: user.id,
                source: 'local',
                identityEmail: email,
                identityKey: email,
                password
            })
        }

        process.exit(0);
    });

}
