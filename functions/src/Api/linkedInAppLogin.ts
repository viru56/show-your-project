export default async (req: any, res: any, admin: any) => {
    try {
        if (
            !req.body.id ||
            !req.body.email
        ) {
            return res.status(400).json({ message: "missing parameter" });
        }
        await admin
            .auth()
            .updateUser(`linkedIn-${req.body.id}`, {
                email: req.body.email,
                emailVerified: true
            })
            .catch((error: any) => {
                // If user does not exists we create it.
                if (error.code === "auth/user-not-found") {
                    return admin.auth().createUser({
                        uid: `linkedIn-${req.body.id}`,
                        email: req.body.email,
                        emailVerified: true
                    });
                }
                throw error;
            });
        const token = await admin.auth().createCustomToken(`linkedIn-${req.body.id}`);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}