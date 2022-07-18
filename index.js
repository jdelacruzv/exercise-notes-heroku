const express = require("express");
const app = express();
const cors = require("cors")
// Important that dotenv is imported before the model note
require("dotenv").config();
const Note = require("./models/note");

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

// To make express show static content (index.html, style.css and the JavaScript, etc.)
app.use(express.static("dist"));

// Activate the json-parser and implement an initial handler for dealing with the HTTP POST requests
app.use(express.json());

app.use(requestLogger);

// Middleware to use and allow for requests from all origins
app.use(cors());

// Get main path
app.get("/", (request, response) => {
	response.send("<h1>Hello World</h1>");
});

// Create note
app.post("/api/notes", (request, response, next) => {	
	const body = request.body;

	// if (body.content === undefined) {
	// 	// 400 bad request
	// 	return response.status(400).json({
	// 		error: "content missing"
	// 	});
	// }

	const note = new Note ({
		content: body.content,
		important: body.important || false,
		date: new Date()
	});

	note.save()
		.then(savedNote => {
			response.json(savedNote);
		})
		.catch(error => next(error));
});

// Read all notes
app.get("/api/notes", (request, response) => {
	Note.find({})
		.then(notes => {
			response.json(notes);
		});
});

// Read note by id
app.get("/api/notes/:id", (request, response, next) => {
	Note.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note);
			} else {
				// 404 not found
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

// Update note by id
app.put("/api/notes/:id", (request, response, next) => {
	const { content, important } = request.body;

	// We added the optional { new: true } parameter, which will cause our event
	// handler to be called with the new modified document instead of the original
	Note.findByIdAndUpdate(
		request.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

// Delete note by id
app.delete("/api/notes/:id", (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(result => {
			// 204 no content
			response.status(204).end();
		})
		.catch(error => next(error));
});

// Unknown endpoint routes
const unknownEndPoint = (request, response) => {
	response.status(404).send({ 
		error: "unknown endpoint"
	});
};

// Handler of requests with unknown endpoint
app.use(unknownEndPoint);

// Set error handling into middleware
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	// If the error was caused by an invalid object id for Mongo.
	if (error.name === "CastError") {
		return response.status(400).send({
			error: "malformatted id",
		});
	}
	// If the error was caused by validation errors
	else if (error.name === "ValidationError") {
		return response.status(400).json({
			error: error.message,
		});
	}

	// Middleware passes the error forward to the default Express error handler
	next(error);
};

// Handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} `);
});