const nodeLinkedin = require("node-linkedin-v2");

export default async (req: any, res: any, admin: any) => {
    const clientId = "818qqmeydxglwc";
    const clientSecret = "0oWByvpBGlHhO204";
    const state = "thisisstateoflinkedinprofile";
    try {
        if (
            !req.body.code ||
            !req.body.redirectUrl
        ) {
            return res.status(403).send('unauthorized');
        }
        const linkedIn = new nodeLinkedin(
            clientId,
            clientSecret,
            req.body.redirectUrl
        );
        const result = await linkedIn.getAccessToken(
            req.body.code,
            state
        );
        const email = await linkedIn.getCurrentMemberEmail(result.access_token);
        const profile = await linkedIn.getCurrentMemberProfile(
            [
                "id",
                "firstName",
                "lastName",
                "profilePicture(displayImage~digitalmediaAsset:playableStreams)"
            ],
            result.access_token
        );
        await admin
            .auth()
            .updateUser(`linkedIn-${profile.id}`, {
                email: email.elements[0]["handle~"].emailAddress,
                emailVerified: true
            })
            .catch((error: any) => {
                // If user does not exists we create it.
                if (error.code === "auth/user-not-found") {
                    return admin.auth().createUser({
                        uid: `linkedIn-${profile.id}`,
                        email: email.elements[0]["handle~"].emailAddress,
                        emailVerified: true
                    });
                }
                throw error;
            });
        const token: string = await admin.auth().createCustomToken(`linkedIn-${profile.id}`);
        const returnData: any = {
            token,
            email: email.elements[0]["handle~"].emailAddress,
            firstName: profile.firstName.localized.en_US,
            lastName: profile.lastName.localized.en_US,
            photoUrl:
                profile.profilePicture["displayImage~"].elements[1].identifiers[0]
                    .identifier,
            id: `linkedIn-${profile.id}`
        };
        res.status(200).json(returnData);
    } catch (error) {
        return res.status(400).json(error);
    }
}