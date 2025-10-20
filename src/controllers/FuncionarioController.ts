import type {Request, Response} from "express";
import { prisma } from "../lib/prisma.js";
import { z} from "zod";

const createFuncionarioSchema = z.object({
  nome: z.string().min(3),
  email: z.email({ message: "Email inválido"}),
  telefone: z.string().optional(), 
  cargo: z.string().min(2),
  setor: z.string().min(2),
});

const updateFuncionarioSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email({ message: "Email inválido"}).optional(),
  telefone: z.string().optional(),
  cargo: z.string().min(2).optional(),
  setor: z.string().min(2).optional(),
})

export class FuncionariosController {

  // Create (POST)
  async create(req: Request, res: Response){
    try {
      const dadosValidos = createFuncionarioSchema.parse(req.body);

      const funcionario = await prisma.funcionario.create({
        data: dadosValidos
      })

      return res.status(201).json(funcionario)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return res.status(400).json({ error: "Erro ao criar funcionário!", message})
    }
  }


  // Read (GET)
  async findAll(req: Request, res: Response){
    try {
      const funcionarios = await prisma.funcionario.findMany();

      return res.status(200).json(funcionarios)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return res.status(500).json({error: "Erro ao buscar funcionários!", message})
    }
  }

  // Read By ID (GET)
  async findById(req: Request, res: Response){
    try {
      const {id} = req.params;

      const funcionario = await prisma.funcionario.findUnique({
        where: {id: id},
      });

      if(!funcionario){
        return res.status(404).json({error: "Funcionário não encontrado!"});
      }

      return res.status(200).json(funcionario)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return res.status(500).json({error: "Erro ao buscar funcionário!", message})
    }
  }

  async Update(req: Request, res: Response){
    try {
      const {id} = req.params;
      const dadosValidos = updateFuncionarioSchema.parse(req.body);

      const funcionario = await prisma.funcionario.update({
        where: {id: id},
        data: dadosValidos
      })

      return res.status(200).json({message: "Funcionário atualizado com sucesso!", funcionario})
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as any).code === 'P2025') {
      const message = error instanceof Error ? error.message : String(error);
      return res.status(404).json({ error: "Funcionário não encontrado!", message });
  }

      return res.status(500).json({error: "Erro ao atualizar informações do funcionário"})
    }
  }

  async delete(req: Request, res: Response){
    try {
      const {id} = req.params;

      await prisma.funcionario.delete({
        where: {id: id}
      });

      return res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return res.status(500).json({error: "Erro ao deletar funcionário!", message});
    }
  }
}

