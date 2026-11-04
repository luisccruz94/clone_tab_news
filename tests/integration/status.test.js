const { createServer } = require("node:http");
const next = require("next");

let app;
let server;
let baseUrl;

beforeAll(async () => {
  app = next({ dev: true, dir: process.cwd() });
  await app.prepare();

  server = createServer(app.getRequestHandler());
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
}, 60_000);

afterAll(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  if (app) {
    await app.close();
  }
}, 30_000);

test("GET /api/v1/status returns the application status", async () => {
  const response = await fetch(`${baseUrl}/api/v1/status`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body).toEqual({ status: "ok" });
});
