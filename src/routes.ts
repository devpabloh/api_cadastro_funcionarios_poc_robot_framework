import { Router } from "express";
import { FuncionariosController } from "./controllers/FuncionarioController.js";

const routes = Router();
const funcionariosController = new FuncionariosController();

routes.post("/funcionario", funcionariosController.create );

routes.get("/funcionario", funcionariosController.findAll);

routes.get("/funcionario/:id", funcionariosController.findById);

routes.put("/funcionario/:id", funcionariosController.Update);

routes.delete("/funcionario/:id", funcionariosController.delete);

export {routes}