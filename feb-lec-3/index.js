const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API
app.get("/", (req, res) => {
  return res.send("This is your server");
});

// app.get("/myapp", (req, res) => {
//   console.log("GET /MYAPP");
//   return res.send("This is your myapp route");
// });

app.post("/myapp", (req, res) => {
  console.log("POST /MYAPP");
  return res.send("This is your post request");
});

//query
app.get("/api", (req, res) => {
  console.log(req.query);
  //   const key1 = req.query.key1
  const { key1, key2, key3 } = req.query;
  console.log(key1, key2, key3);
  return res.send("GET /API WORKED");
});

//params
app.get("/api/:id1", (req, res) => {
  const id = req.params;
  console.log(req.params);
  return res.send("GET /API/:ID WORKING");
});

app.get("/api/:id1/:id2", (req, res) => {
  const id = req.params;
  console.log(req.params);
  return res.send("GET /API/:ID1/:ID2 WORKING");
});

app.get("/api/:id1/api1", (req, res) => {
  const id = req.params;
  console.log(req.params);
  return res.send("GET /API/:ID/API1 WORKING");
});

const val = 100;
app.get("/test", (req, res) => {
  return res.send(`This is a ${val}`);
});

//return html
app.get("/myhtml", (req, res) => {
  return res.send(`<html>
    <head></head>
    <body>
    <h3>This is FORM</h3>

    <form action="/form_submit" method="POST"> 
    <label for="name">Name</label>
    <input type="text" name="name"></input>

    <label for="email">Email</label>
    <input type="text" name="email"></input>

    <button type="submit">Submit</button>
    </form>

    </body>
    </html>`);
});

app.post("/form_submit", (req, res) => {
  console.log(req.body);
  return res.send("Form submitted successfully");
});

app.listen(8000, () => {
  console.log("Server is runnung on PORT 8000");
});
