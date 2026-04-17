import http from "http";

const server = http.createServer((request, response) => {
  console.log(request.method);
  console.log(request.url);

  response.writeHead(200, { "content-type": "text/html" });

  switch (request.url) {
    case "/about":
      return response.end("<h1>About page</h1>");

    case "/contact":
      return response.end("<h1>Contact page</h1>");

    default:
      return response.end("<h1>Home page</h1>");
  }

  //   response.writeHead(200, { "content-type": "application/json" });
  //   response.end("Hello world");
  //   response.end(JSON.stringify({ status: "OK" }));

  //   const htmlContent = fs.readFileSync("data/index.html", "utf8");
  //   response.end(htmlContent);
});

server.listen(8000, () => {
  console.log("Server is running at port 8000...");
});