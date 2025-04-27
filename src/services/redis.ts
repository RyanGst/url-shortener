import { createClient, RedisClientType } from "npm:redis@^4.5";

let client: RedisClientType | null = null;

export async function getClient() {
  if (!client) {
    client = createClient({
      url: Deno.env.get("REDIS_URL"),
    });

    await client.connect();
    client.configSet("appendonly", "yes");

  }
  return client;
}
