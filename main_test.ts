import { assertEquals } from "@std/assert";
import deno from "./deno.json" with { type: "json" };
import app from "./main.ts";
import { getClient } from "./src/services/redis.ts";

Deno.test({
  name: "health check",
  permissions: {
    net: true,
    env: true,
  },
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
  permissions: {
    net: true,
    env: true,
  },
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

    const redisClient = await getClient();
    const url = await redisClient.get(body.id);
    assertEquals(url, "https://example.com");
  },
});

Deno.test({
  name: "get link",
  permissions: {
    net: true,
    env: true,
  },
  async fn() {
    const originalUrl = "https://example.com?but-really-long-query-string=1";
    const createRes = await app.request("/create", {
      method: "POST",
      body: JSON.stringify({
        url: originalUrl,
      }),
    });

    const createBody = await createRes.json();
    assertEquals(createRes.status, 200);
    assertEquals(createBody.status, "ok");
    assertEquals(createBody.body.url, originalUrl);

    const res = await app.request(`/${createBody.id}`);
    assertEquals(res.status, 302);
    assertEquals(res.headers.get("Location"), originalUrl);
  },
});

Deno.test({
  name: "get link not found",
  permissions: {
    net: true,
    env: true,
  },
  async fn() {
    const res = await app.request("/1");
    assertEquals(res.status, 404);
    const body = await res.json();
    assertEquals(body.status, "not found");
  },
});
