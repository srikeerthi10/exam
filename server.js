let express = require("express");
let app = express();
let port = 8080;

app.get('/', (req, res) => {
    res.send("Working");
});

let books = [
    {
        title: "abc",
        author: "abc",
        price: 1500
    },
    {
        title: "Backend using Express",
        author: "Dg Morgan",
        price: 2000
    },
    {
        title: "Frontend",
        author: "Mitchel Jhonson",
        price: 2500
    }
];

app.get('/books', (req, res) => {
    res.json(books);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
