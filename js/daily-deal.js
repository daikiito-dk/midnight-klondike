/*
 * Daily Deal generator for Midnight Klondike.
 *
 * Builds the standard Klondike tableau from a deterministic deck while
 * leaving the existing Classic deal flow untouched.
 */
(function (root) {
  "use strict";

  function createDeal(date) {
    if (!root.MidnightDailyRng) {
      throw new Error("MidnightDailyRng must be loaded first");
    }

    const deck = root.MidnightDailyRng.createDailyDeck(date);
    const tableau = [];
    let cursor = 0;

    for (let column = 0; column < 7; column++) {
      const pile = [];
      for (let row = 0; row <= column; row++) {
        pile.push({
          id: deck[cursor++],
          faceUp: row === column,
        });
      }
      tableau.push(pile);
    }

    return Object.freeze({
      date,
      deck: Object.freeze(deck.slice()),
      tableau: Object.freeze(tableau.map((pile) => Object.freeze(pile))),
      remaining: Object.freeze(deck.slice(cursor)),
    });
  }

  root.MidnightDailyDeal = Object.freeze({
    createDeal,
  });
})(typeof window !== "undefined" ? window : globalThis);
