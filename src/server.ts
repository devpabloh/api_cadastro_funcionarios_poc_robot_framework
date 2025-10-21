import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes.js";

// importação do swagger
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

dotenv.config();

const app = express();

app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Cadastro de Funcionários POC Robot Framework',
      version: '1.0.0',
      description: 'API para cadastro de funcionários, utilizada como prova de conceito para testes com Robot Framework.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      }
    ]
  },
  apis: ['./src/routes.ts']
}

const openapiSpecification = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

app.use(routes);

app.get("/", (req, res)=>{
  res.send("API de Cadastro de Funcionários POC Robot Framework");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Servidor rodando na porta ${PORT}`)
});