import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(routes);

app.get("/", (req, res)=>{
  res.send("API de Cadastro de Funcionários POC Robot Framework");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Servidor rodando na porta ${PORT}`)
});