const Calificacion = require("../models/calificacion.model");
const Candidata = require("../models/candidata.model");

async function getCandidata(req, res) {
  try {
    const list = await Candidata.find();
    res.status(200).json({
      Candidatas: list,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error!",
    });
  }
}

async function getByIdCandidata(req, res) {
  const idCandidata = req.params.id;
  try {
    const candidata = await Candidata.findById(idCandidata).exec();

    if (candidata) {
      res.status(200).send({ candidata });
    } else {
      res.status(404).send({ message: "No existe candidata!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error!" });
  }
}
async function saveCandidata(req, res) {
  const params = req.body;
  const candidata = new Candidata();

  if (params.nombre) {
    /*const calificacion = await Calificacion.findById(
      params.calificacion
    ).exec();
    if (!calificacion) {
      res.status(404).send({ message: "Calificación no encontrada!" });
    }*/
    candidata.imagen = params.imagen;
    candidata.nombre = params.nombre;
    candidata.edad = params.edad;
    //candidata.calificacion = calificacion;
    try {
      const candidataStored = await candidata.save();
      if (candidataStored) {
        res.status(200).send({
          candidata: candidataStored,
          message:"Ingreso exitoso."
        });
      } else {
        res.status(500).send({
          message: "Error al guardar calificación!",
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Error del servidor!",
      });
    }
  } else {
    res.status(400).send({
      message: "Nombre obligatorio!",
    });
  }
}

async function updateCandidata(req, res) {
  const idCandidata = req.params.id;
  const update = req.body;

  try {
    const candidataUpdated = await Candidata.findByIdAndUpdate(
      idCandidata,
      update,
      { new: true }
    ).exec();
    if (candidataUpdated) {
      res.status(200).send({ candidata: candidataUpdated });
    } else {
      res.status(404).send({ message: "No existe candidata!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error!" });
  }
}

async function deleteCandidata(req, res) {
  const idCandidata = req.params.id;

  try {
    const candidataRemoved = await Candidata.findOneAndDelete({
      _id: idCandidata,
    }).exec();

    if (candidataRemoved) {
      res
        .status(200)
        .send({ Candidata: candidataRemoved, message: "Eliminación exitosa" });
    } else {
      res.status(404).send({ message: "No existe candidata!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error!" });
  }
}

module.exports = {
  getCandidata,
  getByIdCandidata,
  saveCandidata,
  updateCandidata,
  deleteCandidata,
};
