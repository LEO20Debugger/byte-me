import { describe, it, expect } from "vitest";
import {
  getRandomMessage,
  scheduleFun,
} from "../src/lib/lib.js";
import messages from "../src/json/messages.json";

describe("getRandomMessage", () => {
  it("returns a non-empty string", () => {
    const msg = getRandomMessage();
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });

  it("returns an error-pool message when error: true", () => {
    // Run several times since selection is random.
    for (let i = 0; i < 50; i++) {
      const msg = getRandomMessage({ error: true });
      expect(messages.errors).toContain(msg);
    }
  });

  it("always returns a string across many calls (no undefined/null)", () => {
    for (let i = 0; i < 200; i++) {
      const msg = getRandomMessage();
      expect(typeof msg).toBe("string");
      expect(msg).not.toBe("");
    }
  });
});

describe("messages.json integrity", () => {
  const requiredPools = [
    "general",
    "tips",
    "jokes",
    "inspiration",
    "morning",
    "night",
    "weekend",
    "errors",
  ];

  it("contains every expected message pool", () => {
    for (const pool of requiredPools) {
      expect(Array.isArray(messages[pool])).toBe(true);
    }
  });

  it("has no empty pools", () => {
    for (const pool of requiredPools) {
      expect(messages[pool].length).toBeGreaterThan(0);
    }
  });

  it("contains only non-empty strings", () => {
    for (const pool of requiredPools) {
      for (const entry of messages[pool]) {
        expect(typeof entry).toBe("string");
        expect(entry.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("scheduleFun input validation", () => {
  it("throws a TypeError when cronTime is not a string", () => {
    expect(() => scheduleFun({ cronTime: 123 })).toThrow(TypeError);
    expect(() => scheduleFun({ cronTime: {} })).toThrow(TypeError);
    expect(() => scheduleFun({ cronTime: null })).toThrow(TypeError);
  });
});
