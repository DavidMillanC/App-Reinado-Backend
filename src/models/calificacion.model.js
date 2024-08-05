const mongoose = require("mongoose");
const schema = mongoose.Schema;

const calificacionSchema = schema({
  concepto: String,
  puntaje: Number,
  candidata: {
    _id: mongoose.Types.ObjectId,
    imagen: String,
    nombre: String,
  },
});

module.exports = mongoose.model("calificacione", calificacionSchema);
