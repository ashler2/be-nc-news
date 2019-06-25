process.env.NODE_ENV = "test";
const { app } = require("../server/app");
const request = require("supertest")(app);
const chai = require("chai");
const expect = chai.expect;
const connection = require("../server/connection");

describe("/api/topics", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    connection.destroy();
  });
  it("returns a list of topics", () => {
    return request
      .get("/api/topics")
      .expect(200)
      .then(res => {
        expect(res.body).to.eql({
          topics: [
            {
              slug: "mitch",
              description: "The man, the Mitch, the legend"
            },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" }
          ]
        });
        expect(res.body.topics.length).to.eql(3);
        expect(res.body).to.have.keys("topics");
      });
  });
  it("/api/users:username", () => {});
});
