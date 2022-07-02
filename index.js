const express = require("express");
const cors = require("cors")
const app = express();

let notes = [
	{
		id: 1,
		content: "HTML is easy",
		date: "2022-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only Javascript",
		date: "2022-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2022-05-30T19:20:14.298Z",
		important: true,
	},
];

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

app.use(express.static("dist"));

// Middleware to use and allow for requests from all origins
app.use(cors());

// Activate the json-parser and implement an initial handler for dealing with the HTTP POST requests
app.use(express.json());

app.use(requestLogger);

// Obtener la ruta principal
app.get("/", (request, response) => {
	response.send("<h1>Hello World</h1>");
});

// Obtener todas las notas
app.get("/api/notes", (request, response) => {
	response.json(notes);
});

// Obtener nota
app.get("/api/notes/:id", (request, response) => {
	const id = Number(request.params.id);
	const note = notes.find(note => note.id === id);
	if (!note) return response.status(404).end();
	response.json(note);
});

// Eliminar nota
app.delete("/api/notes/:id", (request, response) => {
	const id = Number(request.params.id);
	notes = notes.filter(note => note.id !== id);
	response.status(204).end();
});

const generatedId = () => {
	const maxId = notes.length > 0
		? Math.max(...notes.map(n => n.id))
		: 0;
	return maxId + 1;
};

// Crear nota
app.post("/api/notes", (request, response) => {	
	const body = request.body;
	/* 
		If the received data is missing a value for the content property, the
		server will respond to the request with the status code 400 bad request: 
	*/
	if (!body.content) {
		return response.status(400).json({
			error: "content missing"
		});
	}

	const note = {
		content: body.content,
		important: body.important || false,
		date: new Date(),
		id: generatedId()
	};

	notes = notes.concat(note);
	response.json(note);
});

const unknownEndPoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint"});
};

// Middleware para rutas desconocidas
app.use(unknownEndPoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} `);
});



/* 
const http = require("http");

let notes = [
	{
		id: 1,
		content: "HTML is easy",
		date: "2022-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only Javascript",
		date: "2022-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2022-05-30T19:20:14.298Z",
		important: true,
	},
];

const app = http.createServer((request, response) => {
	response.writeHead(200, { "Content-Type": "application/json" });
	//  El array notas se transforma en formato JSON
	response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
*/