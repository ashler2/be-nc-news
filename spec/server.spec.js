process.env.NODE_ENV = "test";
const { app } = require("../server/app");
const request = require("supertest")(app);
const chai = require("chai");
const expect = chai.expect;
const connection = require("../server/connection");
describe("tests", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    connection.destroy();
  });

  describe("/api/topics", () => {
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
    it("Error 405 - ivalid methods on URL", () => {
      const invaildMethods = ["patch", "delete", "post"];
      const methodPromises = invaildMethods.map(method => {
        return request[method]("/api/topics")
          .expect(405)
          .then(res => {
            console.log(res.body);
            expect(res.body).to.eql({ msg: "method not allowed" });
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/users", () => {
    it("/api/users/:username", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({
            user: [
              {
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny"
              }
            ]
          });
        });
    });
  });
});
