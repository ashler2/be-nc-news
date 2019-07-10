process.env.NODE_ENV = "test";
const { app } = require("../server/app");
const request = require("supertest")(app);
const chai = require("chai");

chai.use(require("chai-sorted"));
const expect = chai.expect;
const connection = require("../server/connection");
beforeEach(() => {
  return connection.seed.run();
});
after(() => {
  connection.destroy();
});
describe("tests", () => {
  describe("/api", () => {
    it("expects the json file of end points", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.keys(
            "GET /api",
            "GET /api/articles",
            "GET /api/articles/:articles_id",
            "GET /api/topics",
            "GET /api/users/:username",
            "PATCH /api/articles/:article_id"
          );
        });
    });
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
    it("Error 405 - invalid methods on URL", () => {
      const invalidMethods = ["patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
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

    it("Error 405 - invalid methods on URL", () => {
      const invalidMethods = ["patch", "delete", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/users/butter_bridge")
          .expect(405)
          .then(res => {
            expect(res.body).to.eql({ msg: "method not allowed" });
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/articles/:article_id", () => {
    it("Get /api/articles/:article_id", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({
            article: {
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
            article: {
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
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.eql(110);
          // console.log(res.body);
        });
    });
    it("updates the votes with patch request", () => {
      const test = { inc_votes: 0 };
      return request
        .patch("/api/articles/1")
        .send(test)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.eql(100);
        });
    });
    it("updates to below 0", () => {
      const test = { inc_votes: -110 };
      return request
        .patch("/api/articles/1")
        .send(test)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.eql(-10);
        });
    });

    it("increases from 0", () => {
      const test = { inc_votes: 10 };
      return request
        .patch("/api/articles/2")
        .send(test)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.eql(10);
        })
        .then(() => {
          return request
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.eql(10);
            });
        });
    });
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
            expect(body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
            expect(body.comment.comment_id).to.eql(19);
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
            expect(body.comments.length).to.eql(10);
          });
      });
      it("accepts query for sort by", () => {
        return request
          .get("/api/articles/1/comments?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
            expect(body.comments.length).to.eql(10);
            expect(body.comments).to.be.descendingBy("created_at");
          });
      });
      it("accepts query for sort by and order", () => {
        return request
          .get("/api/articles/1/comments?sort_by=created_at&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
            expect(body.comments.length).to.eql(10);
            expect(body.comments).to.be.descendingBy("created_at");
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      it("Gets all articles", () => {
        return request.get("/api/articles").then(({ body }) => {
          expect(body.articles.length).to.eql(10);
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
            expect(body.articles.length).to.eql(10);
            expect(body.articles).to.be.descendingBy("title");
          });
      });
      it("Gets using sort_by comment count", () => {
        return request
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles.length).to.eql(10);
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
            expect(body.articles.length).to.eql(10);
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
      it("sort_by title with Asc and by selected author That doesn't exist", () => {
        return request
          .get("/api/articles?sort_by=title&&order=ASC&&author=a")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("error: 404 - not found");
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
            expect(body.articles.length).to.eql(10);
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
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(26);
            // console.log(res.body);
          });
      });
      it("returns a patched comment votes negative ", () => {
        const test = { inc_votes: -116 };
        return request
          .patch("/api/comments/1")
          .send(test)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(-100);
            // console.log(res.body);
          });
      });
      it("returns 200 when no body is passed ", () => {
        const test = {};
        return request
          .patch("/api/comments/1")
          .send()
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
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
                expect(body.article.comment_count).to.eql(1);
              });
          });
      });
    });
  });
  describe("Error Handling", () => {
    describe("App.js", () => {
      it("enters invalid url", () => {
        return request
          .get("/apples")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("path does not exist");
          });
      });
    });
    describe("ArticlesRouter.js", () => {
      describe("invalid Methods", () => {
        it("405: error for invalid method - /api/articles/:article_id", () => {
          const invalidMethods = ["post"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/articles/1")
              .expect(405)
              .then(res => {
                expect(res.body).to.eql({
                  msg: "method not allowed"
                });
              });
          });
          return Promise.all(methodPromises);
        });
        it("405: error for invalid method - /:article_id/comments", () => {
          const invalidMethods = ["delete", "patch"];
          const methodPromises = invalidMethods.map(method => {
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
              expect(body.msg).to.eql("Error - 400 invalid input");
            });
        });
        it("Error 400 : column doesn't exist", () => {
          return request
            .get("/api/articles?sort_by=dave")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 400 - invalid input");
            });
        });
        it("requests articles to be ordered by anything other than  ASC or DESC", () => {
          //do i just expect this to return error or default
          return request
            .get("/api/articles?sort_by=created_at&&order=lemon")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 400 - invalid input");
            });
        });
        it("returns 400 when author not there", () => {
          return request
            .get("/api/articles?author=lemon")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("error: 404 - not found");
            });
        });
        it("returns 400 when author is present there but no articles there", () => {
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
        it("400 Error: when presented with invalid format", () => {
          const test = { inc_votes: "10" };
          return request
            .patch("/api/articles/1")
            .send(test)
            .expect(400)
            .then(res => {
              // console.log(res.body.update.votes);

              expect(res.body.msg).to.eql(
                "invalid format - { inc_votes: integer }"
              );
            });
        });
        it("400 invalid format key", () => {
          const test = { inc_boats: 10 };
          return request
            .patch("/api/articles/1")
            .send(test)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.eql(
                "invalid format - { inc_votes: integer }"
              );
            });
        });
        it("200 sent when no body present", () => {
          return request
            .patch("/api/articles/1")
            .send()
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.have.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at"
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
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.eql("un-processable entity");
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
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.eql("un-processable entity");
              });
          });
          it("error 422 - when key wrong name doesn't exist", () => {
            const test = {
              a: "a",
              body: "this was good"
            };
            return request
              .post("/api/articles/1/comments")
              .send(test)
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.eql("un-processable entity");
              });
          });
          it("error 404: comment not found", () => {
            return request
              .get("/api/articles/12/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.eql([]);
              });
          });
          it("error 404: article not found", () => {
            return request
              .get("/api/articles/12222/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.eql("Error 404: article not found");
              });
          });
        });
      });
    });
    describe("CommentsRouter.js", () => {
      describe("invalid methods", () => {
        it("405: error for invalid method - /:article_id/comments", () => {
          const invalidMethods = ["get", "post"];
          const methodPromises = invalidMethods.map(method => {
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
                  "invalid format - { inc_votes: integer }"
                );
              });
          });
          it("error 404 when comment_id doesn't exist ", () => {
            const test = { inc_votes: 10 };
            return request
              .patch("/api/comments/10000000")
              .send(test)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.eql("error 404: comment not found");
              });
          });
          it("delete a comment by invalid comment_id", () => {
            return request
              .delete("/api/comments/tom")
              .expect(400)
              .then(res => {
                expect(res.body.msg).to.eql("error: 400 - invalid input");
              });
          });
          it("delete a comment by comment_id", () => {
            return request
              .delete("/api/comments/1000")
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.eql("error 404: comment not found");
              });
          });
        });
      });
    });
    describe("topicRouter.js", () => {
      describe("invalid methods", () => {
        it("405: error for invalid method - /:article_id/comments", () => {
          const invalidMethods = ["patch", "delete"];
          const methodPromises = invalidMethods.map(method => {
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
      describe("invalid methods", () => {
        it("405: error for invalid method - /users", () => {
          const invalidMethods = ["patch", "post", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/users/1")
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
                expect(res.body.msg).to.eql("404 - invalid username");
              });
          });
        });
      });
    });
    describe("apiRouter.js", () => {
      it("405: error for invalid method - /api", () => {
        const invalidMethods = ["patch", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api")
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
});
describe("Pagination", () => {
  describe("Articles pagination", () => {
    it("returns a limit of by 10 and accepts limit queries", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.eql(10);
        });
    });
    it("returns a limit of by 5 and accepts limit queries", () => {
      return request
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.eql(5);
        });
    });
    it("returns a limit of by 11 and accepts limit queries", () => {
      return request
        .get("/api/articles?limit=11")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.eql(11);
        });
    });
    it("returns a limit of by 10 and accepts page queries and limit", () => {
      return request
        .get("/api/articles?limit=10&p=1")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.eql(2);
        });
    });
    it("returns a limit of by 10 and accepts just page queries", () => {
      return request
        .get("/api/articles?p=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.eql(2);
          expect(body).to.have.keys("articles", "total_count");
        });
    });
    it("accepts other query", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.eql(1);
          expect(body).to.have.keys("articles", "total_count");
          expect(body.total_count).to.eql(1);
        });
    });
  });
  describe("Comment pagination", () => {
    it("returns a limit of by 10 and accepts limit queries", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.eql(10);
        });
    });
    it("returns a limit of by 5 and accepts limit queries", () => {
      return request
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.eql(5);
        });
    });
    it("returns a limit of by 11 and accepts limit queries", () => {
      return request
        .get("/api/articles/1/comments?limit=11")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.eql(11);
        });
    });
    it("returns a limit of by 10 and accepts page queries and limit", () => {
      return request
        .get("/api/articles/1/comments?limit=10&p=1")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.eql(3);
        });
    });
    it("returns a limit of by 10 and accepts just page queries", () => {
      return request
        .get("/api/articles/1/comments?p=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.eql(3);
          expect(body).to.have.keys("comments");
        });
    });
    it("accepts other query", () => {
      return request
        .get("/api/articles/1/comments?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.eql(10);
          expect(body).to.have.keys("comments");
        });
    });
  });
});

describe("Other routes added", () => {
  describe("POST /api/articles", () => {
    it("Posts a comment", () => {
      const test = {
        title: "The test title",
        body:
          "this body is totally not too short, but its for the purposes of testing",
        topic: "mitch",
        author: "butter_bridge"
      };
      return request
        .post("/api/articles/")
        .send(test)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.have.keys(
            "author",
            "article_id",
            "votes",
            "created_at",
            "body",
            "title",
            "topic"
          );
          expect(body.article.article_id).to.eql(13);
        });
    });
    it("error 422: when posting comment with invalid username", () => {
      const test = {
        title: "The test title",
        body:
          "this body is totally not too short, but its for the purposes of testing",
        topic: "mitch",
        author: "dave"
      };
      return request
        .post("/api/articles/")
        .send(test)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("un-processable entity");
        });
    });
    it("error 422: when posting comment with invalid entries", () => {
      const test = {
        title: 1,
        body:
          "this body is totally not too short, but its for the purposes of testing",
        topic: "hello",
        author: "dave"
      };
      return request
        .post("/api/articles/")
        .send(test)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("un-processable entity");
        });
    });
    it("error 422: when posting comment with invalid entries", () => {
      const test = {};
      return request
        .post("/api/articles/")
        .send()
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("un-processable entity");
        });
    });
  });
  describe("DELETE /api/articles/:article_id", () => {
    it("it deletes the article of a given ID", () => {
      return request
        .delete("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({ deleteCount: 1 });
        })
        .then(test => {
          return request
            .get("/api/articles/1")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("article does not exist");
            });
        });
    });
  });

  describe("POST /api/topics", () => {
    it("Posts a topic", () => {
      const test = {
        slug: "testing",
        description: "a topic about testing"
      };
      return request
        .post("/api/topics/")
        .send(test)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.have.keys("slug", "description");
          expect(body.topic.slug).to.eql("testing");
        });
    });
    it("error 422: when posting comment with invalid key name", () => {
      const test = {
        topicName: "testing",
        description: "a topic about testing"
      };
      return request
        .post("/api/topics/")
        .send(test)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("un-processable entity");
        });
    });

    it("error 422: when posting comment with invalid entries", () => {
      const test = {};
      return request
        .post("/api/topics/")
        .send(test)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("un-processable entity");
        });
    });
  });
});
