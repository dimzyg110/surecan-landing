import { describe, it, expect } from "vitest";

describe("Daily.co API Key Validation", () => {
  it("should have valid Daily.co API key", async () => {
    const apiKey = process.env.DAILY_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");

    // Test API key by fetching domain info
    const response = await fetch("https://api.daily.co/v1/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("domain_name");
  }, 30000);
});
