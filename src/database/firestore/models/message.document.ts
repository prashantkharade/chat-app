import { Timestamp } from 'firebase/firestore';

export interface MessageDocument {
    senderId  : number;
    text      : string;
    createdAt : Timestamp;
    readBy    : Record<string, Timestamp>;
}

export interface LastSeenDocument {
    messageId : string;
    seenAt    : Timestamp;
}
