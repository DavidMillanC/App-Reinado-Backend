const express = require("express");
const calificacionController = require("../controllers/calificacion.controller");

const api = express.Router();

api.get("/podium", calificacionController.getPodium);
api.get("/calificacion", calificacionController.getCalificacion);
api.get("/calificacion/:id", calificacionController.getByIdCalificacion);
api.get("/calificacion/candidata/:id", calificacionController.getByIdCandidata);
api.post("/calificacion", calificacionController.saveCalificacion);
api.put("/calificacion/:id", calificacionController.updatedCalificacion);
api.delete("/calificacion/:id", calificacionController.deleteCalificacion);

module.exports = api;
