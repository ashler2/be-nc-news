const { app } = require("./app");

// const PORT = process.env.PORT || 9090;
// app.listen(PORT, () => console.log("listening..."));
// app.listen(9090, () => {
//   console.log("lisntening");
// });
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
