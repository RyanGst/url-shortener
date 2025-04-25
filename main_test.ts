import app from "./main.ts";
import { assertEquals,  } from "https://deno.land/std@0.222.0/assert/mod.ts";
import deno from "./deno.json" with { type: "json" };


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
