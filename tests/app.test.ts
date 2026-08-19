import request from "supertest";
import { createApp } from "../src/app";

describe("Express App Base Suite", () => {
  const app = createApp();

  it("GET /health should return 200 OK", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  it("GET /unknown-route should return 404 Not Found", async () => {
    const response = await request(app).get("/api/non-existent");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("not found");
  });
});
