import { initializeApp } from "firebase-admin/app";
import {
  DocumentData,
  Timestamp,
  WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { z } from "zod";
import chatMessage from "../schemas/chatMessage";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat";

initializeApp();

const db = getFirestore();

export function addDoc<T extends WithFieldValue<DocumentData>>(
  collection: string,
  data: T
) {
  return db.collection(collection).add(data);
}

export function setDoc<T extends WithFieldValue<DocumentData>>(
  documentPath: string,
  data: T
) {
  return db.doc(documentPath).set(data);
}

export function getDoc<T extends WithFieldValue<DocumentData>>(
  documentPath: string
) {
  return db
    .doc(documentPath)
    .get()
    .then((d) => d.data() as T);
}

export function addMessage(message: CreateChatCompletionRequestMessage) {
  return addDoc("messages", {
    message,
    timestamp: new Date(),
  });
}

const record = z.object({
  message: chatMessage,
  timestamp: z.instanceof(Timestamp).transform((t) => t.toDate()),
});

const records = z.array(record);

export async function getMessages() {
  const now = Date.now();
  const hourAgo = now - 1000 * 60 * 60;
  const { docs } = await db
    .collection("messages")
    .where("timestamp", ">=", new Date(hourAgo))
    .get();
  const messages = docs.map((d) => d.data());

  return records.parse(messages);
}
