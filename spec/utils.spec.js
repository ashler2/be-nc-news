process.env.NODE_ENV = "test";

const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns a formatted date for single object", () => {
    const test = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    expect(formatDate(test)).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
  it("formats the date of an array of objects", () => {
    const test = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDate(test)).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),

        votes: 100
      },
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),

        votes: 100
      }
    ]);
    expect(formatDate(test)).to.equal;
  });
  describe("seeding", () => {
    describe("article-test seeding", () => {
      it("articles table has 12 rows", () => {
        //
      });
    });
  });
});

describe("makeRefObj", () => {
  it("returns a reference object for single object in array", () => {
    const test = [
      {
        article_id: 1,
        title: "A"
      }
    ];

    expect(makeRefObj(test, "article_id", "title")).to.eql({ A: 1 });
  });
  it("returns reference obejcts for an array", () => {
    const test = [
      {
        article_id: 1,
        title: "A"
      },
      {
        article_id: 2,
        title: "B"
      }
    ];
    expect(makeRefObj(test, "article_id", "title")).to.eql({ A: 1, B: 2 });
  });
});

describe("formatComments", () => {
  it("formats a comment", () => {
    const tester = [
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?"
      }
    ];
    let news = makeRefObj(tester, "article_id", "title");
    const test = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatDate(test);
    expect(formatComments(test, news)).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ]);
  });
});
