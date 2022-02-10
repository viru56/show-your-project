import * as functions from 'firebase-functions';
export default async (data: any, context: functions.https.CallableContext, admin: any) => {
    try {
        if(!data.subject || !data.message){
            throw new functions.https.HttpsError('invalid-argument', 'The function must be called with subject and message.',data);
        }
        if (!context.auth) {
            throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
        }
        const db = admin.firestore();
        await db.collection("mail").add({
            to: data.to,
            message: {
                subject: data.subject,
                html: data.message
            }
        });
        return { message: "done" };
    } catch (error) {
        return {
            success: 'fail',
            error
        };
    }
}