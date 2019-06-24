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
        created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
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
        created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
        votes: 100
      },
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
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

    expect(makeRefObj(test)).to.eql([{ A: 1 }]);
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
    expect(makeRefObj(test)).to.eql([{ A: 1 }, { B: 2 }]);
  });
});

describe("formatComments", () => {});
