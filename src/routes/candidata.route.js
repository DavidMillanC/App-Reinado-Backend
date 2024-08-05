const express = require("express");
const candidataController = require("../controllers/candidata.controller");

const api = express.Router();

api.get("/candidata", candidataController.getCandidata);
api.get("/candidata/:id", candidataController.getByIdCandidata);
api.post("/candidata", candidataController.saveCandidata);
api.put("/candidata/:id", candidataController.updateCandidata);
api.delete("/candidata/:id", candidataController.deleteCandidata);

module.exports = api;
