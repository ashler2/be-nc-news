## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

<!--
### PATCH `/api/articles`

Assertion: expected 404 to equal 405

- use `.all()` on each route, to serve a 405: Method Not Found status code -->

<!--
### GET `/api/articles/1`

Assertion: expected { Object (articles) } to contain key 'article'

- send the article to the client in an object, with a key of `article`: `{ article: {} }`
- return the single article in an object, not in an array -->

### GET `/api/articles/1`

Assertion: Cannot read property 'comment_count' of undefined

- ensure you have calculated a comment_count for the article

<!-- ### PATCH `/api/articles/1`

Assertion: expected 201 to equal 200

- use a 200: OK status code for successful `patch` requests -->

<!-- ### PATCH `/api/articles/1`

Assertion: expected { Object (update) } to contain key 'article'

- send the updated article with a key of `article` -->

### PATCH `/api/articles/1`

Assertion: expected 400 to equal 200

- ignore a `patch` request with no information in the request body, and send the unchanged article to the client
- provide a default argument of `0` to the `increment` method, otherwise it will automatically increment by 1

<!-- ### GET `/api/articles/1/comments?sort_by=votes`

Assertion: expected 4 to equal 3

- accept a `sort_by` query of any valid column
- order should default to `DESC` - you have it set to 'asc' 🤔 -->

### GET `/api/articles/1/comments?order=asc`

Assertion: expected 2 to equal 18

- accept an `order` query of `asc` or `desc`
- `sort_by` should default to `created_at` - you don't have a default sort_by

### GET `/api/articles/2/comments`

Assertion: expected 404 to equal 200

- return 200: OK when the article exists
- serve an empty array when the article exists but has no comments

### POST `/api/articles/1/comments`

Assertion: expected { Object (postedComment) } to contain key 'comment'

- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`

### POST `/api/articles/10000/comments`

Assertion: expected 400 to be one of [ 404, 422 ]

- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid article ID that does not exist

### PATCH `/api/comments/1`

Assertion: expected 201 to equal 200

- use a 200: OK status code for successful `patch` requests

### PATCH `/api/comments/1`

Assertion: expected { Object (updatedComment) } to contain key 'comment'

- send the updated comment back to the client in an object, with a key of comment: `{ comment: {} }`

### PATCH `/api/comments/1`

Assertion: expected 400 to equal 200

- use 200: OK status code when sent a body with no `inc_votes` property
- send an unchanged comment when no `inc_votes` is provided in the request body

### PATCH `/api/comments/1000`

Assertion: expected 201 to equal 404

- use a 404: Not Found when `PATCH` contains a valid comment_id that does not exist

### DELETE `/api/comments/1000`

Assertion: expected 204 to equal 404

- use a 404: Not Found when `DELETE` contains a valid comment_id that does not exist

### DELETE `/api`

Assertion: expected 404 to equal 405

- use `.all()` on each route, to serve a 405: Method Not Found status code
- end point not made yet, but left it here just so you don't forget 👍

## GENERAL

- personally wouldn't bother parsing each comment_count, would just leave it for the front end. If you you wanted to do this, extract it out as a util function and test it.
- few typos in names of functions etc. eg. destoryComment
- would expect to see getComments to be in the comments model <- you have a few in articles which I'd expect in
- _articlesController_ - I would spread your params and queries into the functions and take them out as parameters in the model.
- _migrations_

```js
usersTable
  .string("username")
  .unique("username") //argument not needed
  .primary()
  .notNullable();
```

- _errors_ - You're not invoking `next` in your `sendCustomError` function so errors500 will never be called.
- no 405 handler in on `/api/articles/` path
- _commentsController_ - I wouldn't bother passing deletedComments to the then block as you're not using it.
- you can refactor your patchVotes. Incrementing by a negative number is the same as decrementing 👍
- _destoryComment_ - you have a then block which isn't doing anything. You should deal with your 404 error here.
- _getTopics_ - model is doing half the job for the controller!
