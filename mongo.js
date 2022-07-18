const mongoose = require("mongoose");

// Returns an array containing the command-line arguments
if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
	process.exit(1);
}

const username = "user-fullstackopen";
const password = process.argv[2];
const database = "fullstackopen";
const url = `mongodb+srv://${username}:${password}@cluster0.a3agc.mongodb.net/${database}?retryWrites=true&w=majority`;

// Define el Schema (como seran almacenados los datos en la bd)
const noteSchema = new mongoose.Schema({
	content: String,
	date: Date,
	important: Boolean,
});

// Define el modelo ( Schema compilado)
const Note = mongoose.model("Note", noteSchema);

mongoose
	.connect(url)
	.then((result) => {
		console.log("connected");
		const note = new Note({
			content: "Javascript is Easy",
			date: new Date(),
			important: true
		});
		return note.save()
	})
	.then(() => {
		console.log("not saved!");
		return mongoose.connection.close();
	})
	.catch((err) => console.log(err));

// Obtener todas notas
Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note);
	});
	mongoose.connection.close();
});

// Obtener las notas cuya clave important sean true
/* Note.find({ important: true }).then((result) => {
	result.forEach((note) => {
		console.log(note);
	});
	mongoose.connection.close();
}); */
