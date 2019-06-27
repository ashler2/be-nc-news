process.env.NODE_ENV = "test";
const { app } = require("../server/app");
const request = require("supertest")(app);
const chai = require("chai");

chai.use(require("chai-sorted"));
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
            user: {
              username: "butter_bridge",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              name: "jonny"
            }
          });
        });
    });

    it("Error 405 - ivalid methods on URL", () => {
      const invaildMethods = ["patch", "delete", "post"];
      const methodPromises = invaildMethods.map(method => {
        return request[method]("/api/users/butter_bridge")
          .expect(405)
          .then(res => {
            expect(res.body).to.eql({ msg: "method not allowed" });
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/atricles/:article_id", () => {
    it("Get /api/atricles/:article_id", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({
            articles: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13
            }
          });
        });
    });
    it("returns the comment count when 0", () => {
      return request
        .get("/api/articles/2")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({
            articles: {
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              body:
                "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2014-11-16T12:21:54.171Z",
              comment_count: 0
            }
          });
        });
    });
    it("updates the votes with patch request", () => {
      const test = { inc_votes: 10 };
      return request
        .patch("/api/articles/1")
        .send(test)
        .expect(201)
        .then(res => {
          expect(res.body.update.votes).to.eql(110);
          // console.log(res.body);
        });
    });
    it("updates to below 0", () => {
      const test = { inc_votes: -110 };
      return request
        .patch("/api/articles/1")
        .send(test)
        .expect(201)
        .then(res => {
          expect(res.body.update.votes).to.eql(-10);
        });
    });

    it("increases from 0", () => {
      const test = { inc_votes: 10 };
      return request
        .patch("/api/articles/2")
        .send(test)
        .expect(201)
        .then(res => {
          expect(res.body.update.votes).to.eql(10);
        })
        .then(() => {
          return request
            .get("/api/articles/2")
            .expect(200)
            .then(res => {
              expect(res.body.articles.votes).to.eql(10);
            });
        });
    });

    // insomnia not working as dev?
    // test for invaild article ID
  });
  describe("/api/articles/:article_id/comment", () => {
    describe("Post", () => {
      it("Posts a comment", () => {
        const test = { username: "butter_bridge", body: "this was good" };
        return request
          .post("/api/articles/2/comments")
          .send(test)
          .expect(201)
          .then(({ body }) => {
            expect(body.postedComment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
            expect(body.postedComment.comment_id).to.eql(19);
          });
      });
    });
    describe("Get", () => {
      it("Gets the comments", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
            expect(body.comments.length).to.eql(13);
          });
      });
      it("accepts query for sort by", () => {
        return request
          .get("/api/articles/1/comments?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
            expect(body.comments.length).to.eql(13);
            expect(body.comments).to.be.ascendingBy("created_at");
          });
      });
      it("accepts query for sort by and order", () => {
        return request
          .get("/api/articles/1/comments?sort_by=created_at&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
            expect(body.comments.length).to.eql(13);
            expect(body.comments).to.be.descendingBy("created_at");
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      it("Gets all articles", () => {
        return request.get("/api/articles").then(({ body }) => {
          expect(body.articles.length).to.eql(12);
          expect(body.articles).to.be.descendingBy("created_at");
        });
      });
      it("Gets using sort_by", () => {
        return request
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            // console.log(body);

            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(12);
            expect(body.articles).to.be.descendingBy("title");
          });
      });
      it("Gets using sort_by comment count", () => {
        return request
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(12);
            expect(body.articles).to.be.descendingBy("comment_count");
          });
      });
      it("sort_by Asc", () => {
        return request
          .get("/api/articles?sort_by=title&&order=ASC")
          .expect(200)
          .then(({ body }) => {
            // console.log(body);

            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(12);
            expect(body.articles).to.be.ascendingBy("title");
          });
      });
      it("sort_by title with Asc and by selected author", () => {
        return request
          .get("/api/articles?sort_by=title&&order=ASC&&author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            // console.log(body);

            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(6);
            expect(body.articles).to.be.ascendingBy("title");
          });
      });
      it("sort_by title with Asc and by selected author by topic", () => {
        return request
          .get(
            "/api/articles?sort_by=title&&order=ASC&&author=icellusedkars&&topic=mitch"
          )
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.eql("mitch");
            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(6);
            expect(body.articles).to.be.ascendingBy("title");
          });
      });
      it("works with just topic", () => {
        return request
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.eql("mitch");
            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(11);
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("Patch comments", () => {
      it("returns a patched comment ", () => {
        const test = { inc_votes: 10 };
        return request
          .patch("/api/comments/1")
          .send(test)
          .expect(201)
          .then(({ body }) => {
            expect(body.updatedComment.votes).to.eql(26);
            // console.log(res.body);
          });
      });
      it("returns a patched comment votes negative ", () => {
        const test = { inc_votes: -116 };
        return request
          .patch("/api/comments/1")
          .send(test)
          .expect(201)
          .then(({ body }) => {
            expect(body.updatedComment.votes).to.eql(-100);
            // console.log(res.body);
          });
      });
    });
    describe("Delete Comment", () => {
      it("delete a comment by comment_id", () => {
        return request
          .delete("/api/comments/1")
          .expect(204)
          .then(res => {})
          .then(test => {
            return request
              .get("/api/articles/9")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles.comment_count).to.eql(1);
              });
          });
      });
    });
  });
  describe("Error Handling", () => {
    describe("App.js", () => {
      it("enters invaild url", () => {
        return request
          .get("/apples")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("path does not exist");
          });
      });
    });
    describe("ArticlesRouter.js", () => {
      describe("invaild Methods", () => {
        it("405: error for invaild method - /api/articles/:article_id", () => {
          const invaildMethods = ["delete", "post"];
          const methodPromises = invaildMethods.map(method => {
            return request[method]("/api/articles/1")
              .expect(405)
              .then(res => {
                expect(res.body).to.eql({ msg: "method not allowed" });
              });
          });
          return Promise.all(methodPromises);
        });
        it("405: error for invaild method - /:article_id/comments", () => {
          const invaildMethods = ["delete", "patch"];
          const methodPromises = invaildMethods.map(method => {
            return request[method]("/api/articles/1/comments")
              .expect(405)
              .then(res => {
                expect(res.body).to.eql({
                  msg: "method not allowed"
                });
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("other errors", () => {
        it("Error 404 : article not found", () => {
          return request
            .get("/api/articles/100")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("article does not exist");
            });
        });
        it("Error 400 : article not found - when presented with /dogs", () => {
          return request
            .get("/api/articles/dogs")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("Error - 400 invaild input");
            });
        });
        it("Error 400 : column doesnt exist", () => {
          return request
            .get("/api/articles?sort_by=dave")
            .expect(400)
            .then(({ body }) => {
              console.log(body);
              expect(body.msg).to.eql("error: 400 - invaild input");
            });
        });
        it("requests artiles to be ordered by anything other than  ASC or DESC", () => {
          //do i just expect this to return error or default
          return request
            .get("/api/articles?sort_by=created_at&&order=lemon")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 400 - invalid innput");
            });
        });
        it("returns 400 when autor not there", () => {
          return request
            .get("/api/articles?author=lemon")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 404 - not found");
            });
        });
        it("returns 400 when autor is present there but no articles there", () => {
          return request
            .get("/api/articles?author=do_nothing")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 404 - not found");
            });
        });
        it("returns 400 when topic not there", () => {
          return request
            .get("/api/articles?topic=lemon")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 404 - not found");
            });
        });
        it("400 Error: when presented with invaild format", () => {
          const test = { inc_votes: "10" };
          return request
            .patch("/api/articles/1")
            .send(test)
            .expect(400)
            .then(res => {
              // console.log(res.body.update.votes);

              expect(res.body.msg).to.eql(
                "invaild format - { inc_votes: integer }"
              );
            });
        });
        it("400 invaild format key", () => {
          const test = { inc_boats: 10 };
          return request
            .patch("/api/articles/1")
            .send(test)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.eql(
                "invaild format - { inc_votes: integer }"
              );
            });
        });
        describe("/api/articles/comments", () => {
          it("error 400 - when wrong article", () => {
            const test = {
              username: "butter_bridge",
              body: "this was good"
            };
            return request
              .post("/api/articles/1000/comments")
              .send(test)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql("error: 400 - invaild input");
              });
          });
          it("error 400 - when username doesn't exist", () => {
            const test = {
              username: "a",
              body: "this was good"
            };
            return request
              .post("/api/articles/1/comments")
              .send(test)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql("error: 400 - invaild input");
              });
          });
          it("error 400 - when key wrong name doesn't exist", () => {
            const test = {
              a: "a",
              body: "this was good"
            };
            return request
              .post("/api/articles/1/comments")
              .send(test)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql("error: 400 - invaild input");
              });
          });
          it("error 404: comment not found", () => {
            return request
              .get("/api/articles/12/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.eql("Error 404: No comments Found");
              });
          });
        });
      });
    });
    describe("CommentsRouter.js", () => {
      describe("invaild menthods", () => {
        it("405: error for invaild method - /:article_id/comments", () => {
          const invaildMethods = ["get", "post"];
          const methodPromises = invaildMethods.map(method => {
            return request[method]("/api/comments/1")
              .expect(405)
              .then(res => {
                expect(res.body).to.eql({
                  msg: "method not allowed"
                });
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("Other Errors", () => {
        describe("/api/comments/:comment_id", () => {
          it("error when wrong input ", () => {
            const test = { inc_botes: "hello" };
            return request
              .patch("/api/comments/1")
              .send(test)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql(
                  "invaild format - { inc_votes: integer }"
                );
              });
          });
          it("delete a comment by comment_id", () => {
            return request
              .delete("/api/comments/tom")
              .expect(400)
              .then(res => {
                expect(res.body.msg).to.eql("error: 400 - invaild input");
              });
          });
        });
      });
    });
    describe("topicRouter.js", () => {
      describe("invaild menthods", () => {
        it("405: error for invaild method - /:article_id/comments", () => {
          const invaildMethods = ["patch", "post", "delete"];
          const methodPromises = invaildMethods.map(method => {
            return request[method]("/api/topics/")
              .expect(405)
              .then(res => {
                expect(res.body).to.eql({
                  msg: "method not allowed"
                });
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("userRouter.js", () => {
      describe("invaild methods", () => {
        it("405: error for invaild method - /:article_id/comments", () => {
          const invaildMethods = ["patch", "post", "delete"];
          const methodPromises = invaildMethods.map(method => {
            return request[method]("/api/topics/")
              .expect(405)
              .then(res => {
                expect(res.body).to.eql({
                  msg: "method not allowed"
                });
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("other Errors", () => {
        describe("/api/users/username", () => {
          it("returns a 404 when username does exist", () => {
            return request
              .get("/api/users/fred")
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.eql("404 - invaild username");
              });
          });
        });
      });
    });
  });
});
