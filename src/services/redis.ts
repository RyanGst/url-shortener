import { createClient, RedisClientType } from "npm:redis@^4.5";

let client: RedisClientType | null = null;

export async function getClient(): Promise<RedisClientType> {
  if (!client) {
    const host = Deno.env.get("REDIS_HOST");
    const port = Deno.env.get("REDIS_PORT");
    const password = Deno.env.get("REDIS_PASSWORD");

    if (!host || !port) {
      throw new Error("REDIS_HOST and REDIS_PORT environment variables must be set.");
    }

    console.log(`Attempting to connect to Redis at ${host}:${port}`);

    const url = `redis://${host}:${port}`;
    console.log(`Using URL: ${url}, password: ${password}`);
    client = createClient({
      url: url,
      password: password,
    });

    client.on("error", (err) => console.error("Redis Client Error:", err));

    await client.connect();
    console.log("Redis client connected successfully.");
  }
  return client;
}
