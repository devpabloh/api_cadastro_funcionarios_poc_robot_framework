import { Router } from "express";
import { FuncionariosController } from "./controllers/FuncionarioController.js";

const routes = Router();
const funcionariosController = new FuncionariosController();

// --- DEFINIÇÃO DOS SCHEMAS (MODELOS) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     Funcionario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: O ID único do funcionário.
 *         nome:
 *           type: string
 *           description: Nome completo do funcionário.
 *         email:
 *           type: string
 *           format: email
 *           description: Email único do funcionário.
 *         telefone:
 *           type: string
 *           nullable: true
 *           description: Telefone do funcionário.
 *         cargo:
 *           type: string
 *           description: Cargo do funcionário.
 *         setor:
 *           type: string
 *           description: Setor onde o funcionário trabalha.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do registro.
 *     FuncionarioInput:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - cargo
 *         - setor
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do funcionário.
 *           minLength: 3
 *         email:
 *           type: string
 *           format: email
 *           description: Email único do funcionário.
 *         telefone:
 *           type: string
 *           nullable: true
 *           description: Telefone do funcionário (opcional).
 *           minLength: 10
 *           maxLength: 15
 *         cargo:
 *           type: string
 *           description: Cargo do funcionário.
 *           minLength: 2
 *         setor:
 *           type: string
 *           description: Setor onde o funcionário trabalha.
 *           minLength: 2
 *     FuncionarioUpdateInput:
 *       type: object
 *       description: Campos para atualizar um funcionário (todos são opcionais).
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *         email:
 *           type: string
 *           format: email
 *         telefone:
 *           type: string
 *           nullable: true
 *         cargo:
 *           type: string
 *           minLength: 2
 *         setor:
 *           type: string
 *           minLength: 2
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Descrição curta do erro.
 *         message:
 *           type: string
 *           description: Mensagem detalhada do erro.
 */


// --- DOCUMENTAÇÃO DAS ROTAS ---

/**
 * @swagger
 * tags:
 *   - name: Funcionarios
 *     description: API para gerenciamento de funcionários
 */

/**
 * @swagger
 * /funcionario:
 *   post:
 *     summary: Cria um novo funcionário
 *     tags:
 *       - Funcionarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionarioInput'
 *     responses:
 *       '201':
 *         description: Funcionário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       '400':
 *         description: Erro de validação (dados inválidos).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routes.post("/funcionario", funcionariosController.create );

/**
 * @swagger
 * /funcionario:
 *   get:
 *     summary: Lista todos os funcionários
 *     tags:
 *       - Funcionarios
 *     responses:
 *       '200':
 *         description: Lista de funcionários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
 *       '500':
 *         description: Erro interno do servidor.
 */
routes.get("/funcionario", funcionariosController.findAll);

/**
 * @swagger
 * /funcionario/{id}:
 *   get:
 *     summary: Busca um funcionário pelo ID
 *     tags:
 *       - Funcionarios
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: O ID do funcionário.
 *     responses:
 *       '200':
 *         description: Dados do funcionário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       '404':
 *         description: Funcionário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '400':
 *         description: ID inválido.
 */
routes.get("/funcionario/:id", funcionariosController.findById);

/**
 * @swagger
 * /funcionario/{id}:
 *   put:
 *     summary: Atualiza um funcionário existente
 *     tags:
 *       - Funcionarios
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: O ID do funcionário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionarioUpdateInput'
 *     responses:
 *       '200':
 *         description: Funcionário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 funcionario:
 *                   $ref: '#/components/schemas/Funcionario'
 *       '404':
 *         description: Funcionário não encontrado.
 *       '400':
 *         description: Erro de validação ou ID inválido.
 */
routes.put("/funcionario/:id", funcionariosController.update);

/**
 * @swagger
 * /funcionario/{id}:
 *   delete:
 *     summary: Deleta um funcionário
 *     tags:
 *       - Funcionarios
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: O ID do funcionário a ser deletado.
 *     responses:
 *       '204':
 *         description: Funcionário deletado com sucesso (sem conteúdo).
 *       '404':
 *         description: Funcionário não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
routes.delete("/funcionario/:id", funcionariosController.delete);

export {routes}