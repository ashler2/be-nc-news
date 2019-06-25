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
        console.log(res);
      });
  });
});
