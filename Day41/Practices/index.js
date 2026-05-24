// fetch("https://jsonplaceholder.typicode.com/todos/1")
// .then((response) => response.json())
// .then(json => console.log(json))

async function fetechData() {
    const respone = await fetch("https://jsonplaceholder.typicode.com/todos");

    const data = await respone.json();
    console.log(data);
}
fetechData();