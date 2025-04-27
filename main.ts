import { Hono } from "hono";
import deno from "./deno.json" with { type: "json" };
import { getClient } from "./src/services/redis.ts";

const redis = await getClient();

const app = new Hono();

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    version: deno.version,
  });
});

app.post("/create", async (c) => {
  const body = await c.req.json();

  return c.json({
    status: "ok",
    version: deno.version,
    body,
  });
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.json({
    status: "ok",
    version: deno.version,
    id,
  });
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

Deno.serve(app.fetch);

export default app;
