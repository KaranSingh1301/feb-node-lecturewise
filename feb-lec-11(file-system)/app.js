const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.method, " ", req.url);
//   const DataString = "new msg";

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("This is HTTP server");
//   }
//   //create or write in a file
//   else if (req.method === "GET" && req.url === "/append") {
//     fs.appendFile("demo.txt", DataString, (err) => {
//       if (err) throw err;
//       console.log("appended!");
//       return res.end("Appended!");
//     });
//   } else if (req.method === "GET" && req.url === "/writefile") {
//     //writeFile
//     fs.writeFile("demo1.txt", DataString, (err) => {
//       if (err) throw err;
//       console.log("Write");
//       return res.end("WriteFile");
//     });
//   }
//   //read
//   else if (req.method === "GET" && req.url === "/readfile") {
//     fs.readFile("demo.txt", (err, data) => {
//       res.write(data);
//       return res.end();
//     });
//   }

//   //delete
//   else if (req.method === "GET" && req.url === "/deletefile") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;
//       console.log("deleted");
//       return res.end("Deleted");
//     });
//   }

//   //rename
//   else if (req.method === "GET" && req.url === "/rename") {
//     fs.rename("demo1.txt", "newfile.txt", (err) => {
//       if (err) throw err;
//       console.log("Deleted");
//       return res.end("Deleted");
//     });
//   }
//   //creating a stream to read a file
//   else if (req.method === "GET" && req.url === "/streamfile") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       res.write(char);
//     });

//     rStream.on("end", () => {
//       res.end();
//     });
//   }
// });

//upload a file
server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    let form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      const oldPath = files.fileToUpload.filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload.originalFilename;

      console.log(oldPath);
      console.log(newPath);

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("File uploaded successfully");
      });
    });
  } else {
    //return html form

    fs.readFile("test.html", (err, data) => {
      if (err) throw err;
      res.write(data);
      return res.end();
    });
  }
});

server.listen(8000, () => {
  console.log("server is running on port 8000");
});
