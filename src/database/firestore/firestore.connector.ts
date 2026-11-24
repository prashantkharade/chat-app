import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, terminate } from 'firebase/firestore';
import { logger } from '../../logger/logger';

export class FirestoreConnector {

    private static _db: Firestore = null;

    static connect = () => {
        const app = initializeApp({
            apiKey            : process.env.FIREBASE_API_KEY,
            authDomain        : process.env.FIREBASE_AUTH_DOMAIN,
            projectId         : process.env.FIREBASE_PROJECT_ID,
            storageBucket     : process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId : process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId             : process.env.FIREBASE_APP_ID,
            measurementId     : process.env.FIREBASE_MEASUREMENT_ID,
        });
        this._db = getFirestore(app);
        logger.info(`Connected to Firestore (${process.env.FIREBASE_PROJECT_ID})`);
    };

    static db = (): Firestore => {
        return this._db;
    };

    static close = async () => {
        if (this._db) {
            await terminate(this._db);
        }
    };

}
