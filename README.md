# News API - Backend

A RESTful API for a News project, built using;

- [Node.js](https://nodejs.org/en/)
- [express.js](https://expressjs.com/)
- [Postgres](https://www.postgresql.org)
- [knex.js](https://knexjs.org/)

The API has been deployed on Heroku [here](https://ash-news-backend.herokuapp.com/).

#

## Getting Started

These instructions will get you a copy of the News API - Backend up and running on your local machine for development and testing purposes.

#

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [express.js](https://expressjs.com/)
- [Postgres](https://www.postgresql.org)
- [knex.js](https://knexjs.org/)

#### Testing prerequisites

- [Chai](https://www.chaijs.com/)

- [chai-sorted](https://www.npmjs.com/package/chai-sorted)
- mocha
- nodemon
- supertest

#

## Set up

A step by step series of examples that tell you how to get a development env running

Check if Node.js is already installed by the following command

```
npm -v
```

> if nothing is installed please refer to this [guide](https://nodejs.org/en/download/package-manager/)

```
Npm i
```

this will install all the dependencies from the package.JSON

#

## Installation

To run this project on your local machine you will need to clone the project to you local directory.

In the command line navigate to the chosen folder and run the following git command;

```
git clone https://github.com/ashler2/be-nc-news
```

to install dependencies run:

```
npm i
```

To set the database up run the following commands in order;

```
npm run setup-db
npm run migrate-latest
npm run migrate-latest-test
npm run seed-test
npm run seed-dev

```

#

## Running the tests

The tests are located within the spec folder.
To run the tests use the following commands:

Sever Tests

```
npm run test
```

Utilities function tests

```
npm run test-utils
```

### Tests

The server test example:

```
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
```

## Testing method

Testing was done for each end point and multiple methods

## Authors

- **Ashley RT** - _Initial work_ - [Ashler2]https://github.com/ashler2)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
