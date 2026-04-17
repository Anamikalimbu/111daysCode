const codeitUrl =
  "https://codeit.com.np/web-development/mern-stack?duration=3months";

const urlObject = new URL(codeitUrl);

console.log(urlObject);

console.log(urlObject.host);
console.log(urlObject.search);

const params = new URLSearchParams(urlObject.search);

params.set("time", "8pm");

console.log(params);