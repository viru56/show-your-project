import * as functions from 'firebase-functions';
export default async (data: any, context: functions.https.CallableContext, admin: any) => {
    try {
        if (!data.uid && !data.email) {
            throw new functions.https.HttpsError('invalid-argument', 'The function must be called with uid and email');
        }
        if (!context.auth) {
            throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
        }
        const db = admin.firestore();
        await db.collection("user").doc(data.email).delete();
        await admin.auth().deleteUser(data.uid);
        return { message: "user deleted successfully" };
    } catch (error) {
        return error
    }
}