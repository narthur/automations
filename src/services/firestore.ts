import { initializeApp } from "firebase-admin/app";
import {
  DocumentData,
  Timestamp,
  WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { z } from "zod";
import { zChatCompletionRequestMessage } from "./openai.schemas";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat";

initializeApp();

const db = getFirestore();

export function addDoc<T extends WithFieldValue<DocumentData>>(
  collection: string,
  data: T
) {
  return db.collection(collection).add(data);
}

export function addMessage(message: CreateChatCompletionRequestMessage) {
  return addDoc("messages", {
    message,
    timestamp: new Date(),
  });
}

const zMessage = z.object({
  message: zChatCompletionRequestMessage,
  timestamp: z.instanceof(Timestamp).transform((t) => t.toDate()),
});

const zMessages = z.array(zMessage);

export async function getMessages() {
  const now = Date.now();
  const hourAgo = now - 1000 * 60 * 60;
  const { docs } = await db
    .collection("messages")
    .where("timestamp", ">=", new Date(hourAgo))
    .get();
  const messages = docs.map((d) => d.data());

  return zMessages.parse(messages);
}
