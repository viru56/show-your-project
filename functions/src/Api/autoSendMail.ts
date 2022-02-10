export default async (req: any, res: any, admin: any) => {
    try {
        console.log(req.body);
        const db = admin.firestore();
        const currentDate = new Date();
        const previousDate = new Date(
            currentDate.setDate(currentDate.getDate() - 1)
        );
        const snapshot = await db
            .collection("user")
            .where("role", "==", "entrepreneur")
            .where("emailVerified","==",true)
            .where("createdAt", ">", previousDate)
            .get();
        await snapshot.forEach(async (doc:any) => {
            const user = doc.data();
            const pitches = await db
                .collection("idea")
                .where("email", "==", user.email)
                .get();
                console.log(`${user.email} - ${pitches.size}`);
            if (pitches.size === 0) {
                console.log(user.email);
                await db.collection("mail").add({
                    to: user.email,
                    message: {
                        subject: "Idea Quick Pitch is not completed",              
                        html: `<p>Hi ${user.firstName} ${user.lastName}</p>
                            <p>You have started your journey to validate and then bring your idea to life.<br/>
                            Let’s keep the momentum going!<br/>
                            To get Experts excited about your idea all you need to do is spend a few minutes to complete a simple “Quick Pitch”</p>
                            <br/>
                            <p>Let’s get it done! <a href='https://show-your-project.firebaseapp.com'>Click Here</a> </p>
                            <br/><br/><br/>
                            <p>Regards,<br/>SYP Team</p>
                            `
                    }
                });
            }
        });
        res.status(200).send({ message: "done" });
    } catch (error) {
        res.status(400).send(error);
    }
}
