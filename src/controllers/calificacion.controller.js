const Calificacion = require("../models/calificacion.model");
const Candidata = require("../models/candidata.model");

async function getCalificacion(req, res) {
  try {
    const list = await Calificacion.find().sort({ candidata: 1 });
    res.status(200).json({
      Calificaciones: list,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error!",
    });
  }
}

async function getByIdCalificacion(req, res) {
  const idCalificacion = req.params.id;

  try {
    const calificacion = await Calificacion.findById(idCalificacion).exec();

    if (calificacion) {
      res.status(200).send({ calificacion });
    } else {
      res.status(404).send({ message: "No existe calificación!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error!" });
  }
}
async function getByIdCandidata(req, res) {
  const idCandidata = req.params.id;
  try {
    const calificacion = await Calificacion.find({
      "candidata._id": idCandidata,
    }).exec();

    if (calificacion) {
      res.status(200).send({ calificacion });
    } else {
      res.status(404).send({ message: "No existe calificación!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error!" });
  }
}

async function saveCalificacion(req, res) {
  const params = req.body;
  const calificacion = new Calificacion();

  if (params.concepto) {
    const candidata = await Candidata.findById(params.candidata).exec();
    if (!candidata) {
      res.status(404).send({
        message: "Candidata no encontrada!",
      });
    }
    calificacion.concepto = params.concepto;
    calificacion.puntaje = params.puntaje;
    calificacion.candidata = candidata;

    try {
      const calificacionStored = await calificacion.save();

      if (calificacionStored) {
        res.status(200).send({
          calificacion: calificacionStored,
          message: "Ingreso exitoso.",
        });
      } else {
        res.status(500).send({
          message: "Error al guardar calificacion!",
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Error del servidor!",
      });
    }
  } else {
    res.status(400).send({
      message: "Concepto obligatorio!",
    });
  }
}

async function updatedCalificacion(req, res) {
  const idCalificacion = req.params.id;
  const update = req.body;

  try {
    const calificacionUpdated = await Calificacion.findByIdAndUpdate(
      idCalificacion,
      update,
      { new: true }
    ).exec();

    if (calificacionUpdated) {
      res.status(200).send({ calificacion: calificacionUpdated });
    } else {
      res.status(404).send({ message: "No existe calificación!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error!" });
  }
}

async function deleteCalificacion(req, res) {
  const idCalificacion = req.params.id;

  try {
    const calificacionRemoved = await Calificacion.findOneAndDelete({
      _id: idCalificacion,
    }).exec();

    if (calificacionRemoved) {
      res.status(200).send({
        Calificacion: calificacionRemoved,
        message: "Eliminación exitosa.",
      });
    } else {
      res.status(404).send({ message: "No existe calificación!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error!" });
  }
}

async function getPodium(req, res) {
  try {
    // Agregación para sumar puntos por candidata y ordenar en orden descendente
    const results = await Calificacion.aggregate([
      {
        $group: {
          _id: "$candidata._id", // Agrupar por ID de la candidata
          puntaje: { $sum: "$puntaje" }, // Sumar los puntos
        },
      },
      {
        $lookup: {
          from: "candidatas", // Nombre de la colección de candidatas
          localField: "_id",
          foreignField: "_id",
          as: "candidata",
        },
      },
      {
        $unwind: "$candidata", // Deshacer la agrupación del array de candidatas
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                _id: "$candidata._id",
                imagen: "$candidata.imagen",
                nombre: "$candidata.nombre",
              },
              { puntaje: "$puntaje" },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0, // Ocultar el campo _id del resultado final
          candidata: {
            _id: "$_id",
            imagen: "$imagen",
            nombre: "$nombre",
          },
          puntaje: "$puntaje", // Incluir el campo totalPuntos
        },
      },
      {
        $sort: { puntaje: -1 }, // Ordenar en orden descendente por totalPuntos
      },
    ]);
    res.status(200).json({
      podium: results,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error al obtener el podium.",
      error: err.message,
    });
  }
}

module.exports = {
  getCalificacion,
  getByIdCalificacion,
  getByIdCandidata,
  saveCalificacion,
  updatedCalificacion,
  deleteCalificacion,
  getPodium,
};
