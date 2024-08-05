const mongoose = require("mongoose");
const schema = mongoose.Schema;

const candidataSchema = schema({
  imagen: String,
  nombre: String,
  edad: Number,
  /*calificacion: {
    _id: mongoose.Types.ObjectId,
    concepto: String,
    puntaje: Number,
  },*/
});

module.exports = mongoose.model("candidata", candidataSchema);
