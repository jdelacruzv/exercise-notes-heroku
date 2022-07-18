const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;
console.log("connecting to", url);

// Conexión a la bd
mongoose.connect(url)
	.then(result => {
		console.log("connected to MongoDB");
	})
	.catch(error => {
		console.log("error connecting to MongoDB:", error.message)
	})

// Define el Schema (como seran almacenados los datos en la bd)
const noteSchema = new mongoose.Schema({
	// Define specific validation rules for each field
	content: {
		type: String,
		minLength: 5,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	important: Boolean,
});

// Modifica el schema para que la propiedad _id venga en formato "id" 
// Elimina las propiedades _id y __v (control de versiones de mongo)
noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

// Exporta el modelo
module.exports = mongoose.model("Note", noteSchema);