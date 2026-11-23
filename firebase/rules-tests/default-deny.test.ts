import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, it } from "vitest";
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, getBytes, uploadString } from "firebase/storage";

// Phase 0: everything is denied. Later phases add allow cases next to the deny cases.
let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-lumio",
    firestore: { rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8") },
    storage: { rules: readFileSync(resolve(__dirname, "../storage.rules"), "utf8") },
  });
});

afterAll(async () => {
  await env?.cleanup();
});

describe("firestore default deny", () => {
  it("denies unauthenticated reads and writes", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "users/alice")));
    await assertFails(setDoc(doc(db, "users/alice"), { a: 1 }));
  });

  it("denies a signed-in user writing their own user doc (until Phase 2 allows it)", async () => {
    const db = env.authenticatedContext("alice").firestore();
    await assertFails(setDoc(doc(db, "users/alice"), { tokenBalance: 9999 }));
  });
});

describe("storage default deny", () => {
  it("denies uploads and downloads", async () => {
    const storage = env.authenticatedContext("alice").storage();
    await assertFails(uploadString(ref(storage, "users/alice/inputs/x.jpg"), "data"));
    await assertFails(getBytes(ref(storage, "public/styles/x/sample.jpg")));
  });
});
