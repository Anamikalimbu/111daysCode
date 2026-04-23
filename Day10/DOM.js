// DOM (Document Object Model) is a programming interface for web documents. It represents the structure of a document as a tree of objects, allowing developers to manipulate the content, structure, and style of a web page dynamically using JavaScript.

// Select elements
const title = document.getElementById("title");
const btn = document.getElementById("btn");

// Add Event Listener
btn.addEventListener("click", () => {
  title.innerText = "DOM Changed!";
  title.style.color = "blue";
});