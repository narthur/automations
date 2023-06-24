import { initializeApp } from "firebase-admin/app";
import {
  DocumentData,
  WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { z } from "zod";

initializeApp();

const db = getFirestore();

export function addDoc<T extends WithFieldValue<DocumentData>>(
  collection: string,
  data: T
) {
  return db.collection(collection).add(data);
}

export function addMessage(
  role: ChatCompletionRequestMessageRoleEnum,
  content: string
) {
  return addDoc("messages", {
    role,
    content,
    timestamp: new Date(),
  });
}

const zMessage = z.object({
  role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
  content: z.string(),
  timestamp: z.date(),
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
