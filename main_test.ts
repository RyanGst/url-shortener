import { assertEquals } from "@std/assert";
import deno from "./deno.json" with { type: "json" };
import app from "./main.ts";

Deno.test({
  name: "health check",
  async fn() {
    const res = await app.request("/health");
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.status, "ok");
    assertEquals(body.version, deno.version);
  },
});

Deno.test({
  name: "create link",
  async fn() {
    const res = await app.request("/create", {
      method: "POST",
      body: JSON.stringify({
        url: "https://example.com",
      }),
    });
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.status, "ok");
    assertEquals(body.body.url, "https://example.com");
  },
});

Deno.test({
  name: "get link",
  async fn() {
    const res = await app.request("/1");
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.status, "ok");
    assertEquals(body.id, "1");
  },
});
