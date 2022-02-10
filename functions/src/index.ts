import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import validateFirebaseIdToken from './services/auth.service';
import idea2pdf from './Api/idea2pdf';
import linkedInLogin from './Api/linkedInLogin';
import linkedinAppLogin from './Api/linkedInAppLogin';
import sendMail from './Api/sendMail';
import autoSendMail from './Api/autoSendMail';
import deleteUser from './Api/deleteUser';
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.idea2pdf = functions.runWith({
  timeoutSeconds: 300,
  memory: '2GB'
}).https.onRequest((request, response) => cors(request, response, () => validateFirebaseIdToken(request, response, admin, idea2pdf)));

exports.linkedInLogin = functions.https.onRequest((request, response) => cors(request, response, () => linkedInLogin(request, response, admin)));

exports.linkedinAppLogin = functions.https.onRequest((request, response) => cors(request, response, () => linkedinAppLogin(request, response, admin)));

exports.sendMail = functions.https.onCall((data: any, context: functions.https.CallableContext) => sendMail(data, context, admin));

exports.autoSendMail = functions.https.onRequest((request, response) => autoSendMail(request, response, admin));

exports.deleteUser = functions.https.onCall((data: any, context: functions.https.CallableContext) => deleteUser(data, context, admin));