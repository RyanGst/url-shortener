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
  const id = crypto.randomUUID();
  await redis.set(id, body.url);

  return c.json({
    status: "ok",
    version: deno.version,
    body,
    id,
  });
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const url = await redis.get(id);
  if (!url) {
    return c.json({
      status: "not found",
    }, 404);
  }
  return c.redirect(url);
});

Deno.serve(app.fetch);

export default app;
