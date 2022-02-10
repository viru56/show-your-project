const validateFirebaseIdToken = async (req: any, res: any, admin: any, callback: Function) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        return res.status(403).send('unauthorized');
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;
        return callback(req, res, admin);
    } catch (error) {
        return res.status(403).send('unauthorized');
    }
};
export default validateFirebaseIdToken;