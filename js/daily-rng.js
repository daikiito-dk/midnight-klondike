/*
 * Deterministic RNG utilities for Midnight Klondike Daily Deal.
 *
 * The generator is intentionally independent from Math.random() so a
 * published Daily Deal can be reproduced from its date on every client.
 */
(function (root) {
  "use strict";

  function hashSeed(text) {
    // FNV-1a 32-bit: small, deterministic, and available without Web Crypto.
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function seedForDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Daily Deal date must be YYYY-MM-DD");
    }
    return hashSeed("midnight-klondike:" + date);
  }

  function createRng(seed) {
    let state = seed >>> 0;
    return function () {
      // Mulberry32: compact deterministic PRNG with a full 32-bit state.
      state = (state + 0x6d2b79f5) | 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(deck, rng) {
    const result = deck.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createDailyDeck(date) {
    const deck = [];
    for (let suit = 0; suit < 4; suit++) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push(suit + "-" + rank);
      }
    }
    return shuffle(deck, createRng(seedForDate(date)));
  }

  root.MidnightDailyRng = Object.freeze({
    hashSeed,
    seedForDate,
    createRng,
    shuffle,
    createDailyDeck,
  });
})(typeof window !== "undefined" ? window : globalThis);
