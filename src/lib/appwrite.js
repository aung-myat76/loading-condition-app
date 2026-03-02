import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const dbId = "69a518ad0022b52d1d78";
const collectionId = "truck-condition";

export { client, account, databases, dbId, collectionId };
