import { Hono } from "hono";
import deno from "./deno.json" with { type: "json" };

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

Deno.serve(app.fetch);
export default app;
