import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import deno from "./deno.json" with { type: "json" };
import { getClient } from "./src/services/redis.ts";
import { encodeBase62 } from "./src/services/encoding.ts";

const redis = await getClient();

const app = new Hono();

app.use("*", serveStatic({ root: "./public" }));
app.get(
  "/",
  (c) => c.html(`<script>window.location.href = '/index.html'</script>`),
);

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    version: deno.version,
  });
});

app.post("/create", async (c) => {
  const body = await c.req.json();
  const id = encodeBase62(Math.floor(Math.random() * 1000000));
  await redis.set(id, body.url);

  return c.json({
    status: "ok",
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
