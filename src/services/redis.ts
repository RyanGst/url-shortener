import { createClient, RedisClientType } from "npm:redis@^4.5";

let client: RedisClientType | null = null;

export async function getClient() {
  if (!client) {
    client = createClient({
      url: "redis://redis:6379",
    });

    await client.connect();
  }
  return client;
}