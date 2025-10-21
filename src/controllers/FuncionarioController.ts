import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { z, ZodError } from 'zod';

const createFuncionarioSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email({ message: 'Email inválido' }),
  telefone: z.string().min(10).max(15).optional().nullable().transform((v) => v ?? null),
  cargo: z.string().min(2),
  setor: z.string().min(2),
});

const updateFuncionarioSchema = z
  .object({
    nome: z.string().min(3),
    email: z.string().email({ message: 'Email inválido' }),
    telefone: z.string().nullable(),
    cargo: z.string().min(2),
    setor: z.string().min(2),
  })
  .partial();

function formatError(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues.map((i) => i.message).join('; ');
  }
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export class FuncionariosController {
  // Create (POST)
  async create(req: Request, res: Response) {
    try {
      const dadosValidos = createFuncionarioSchema.parse(req.body);

      const funcionario = await prisma.funcionario.create({
        data: dadosValidos,
      });

      return res.status(201).json(funcionario);
    } catch (error) {
      const message = formatError(error);
      return res.status(400).json({ error: 'Erro ao criar funcionário!', message });
    }
  }

  // Read (GET)
  async findAll(req: Request, res: Response) {
    try {
      const funcionarios = await prisma.funcionario.findMany();
      return res.status(200).json(funcionarios);
    } catch (error) {
      const message = formatError(error);
      return res.status(500).json({ error: 'Erro ao buscar funcionários!', message });
    }
  }

  // Read By ID (GET)
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'ID do funcionário é obrigatório!' });

      const funcionario = await prisma.funcionario.findUnique({ where: { id } });
      if (!funcionario) return res.status(404).json({ error: 'Funcionário não encontrado!' });

      return res.status(200).json(funcionario);
    } catch (error) {
      const message = formatError(error);
      return res.status(500).json({ error: 'Erro ao buscar funcionário!', message });
    }
  }

  // Update (PATCH/PUT)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'ID do funcionário é obrigatório!' });

      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ error: 'Dados para atualização são obrigatórios!' });

      const dadosValidos = updateFuncionarioSchema.parse(req.body);

      const funcionarioExistente = await prisma.funcionario.findUnique({ where: { id } });
      if (!funcionarioExistente) return res.status(404).json({ error: 'Funcionário não encontrado!' });

      const funcionario = await prisma.funcionario.update({ where: { id }, data: dadosValidos });
      return res.status(200).json({ message: 'Funcionário atualizado com sucesso!', funcionario });
    } catch (error) {
      // Prisma not found error
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
        const message = formatError(error);
        return res.status(404).json({ error: 'Funcionário não encontrado!', message });
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação.',
          issues: error.issues.map((issue) => ({ campo: issue.path.join('.'), mensagem: issue.message })),
        });
      }

      const message = formatError(error);
      return res.status(500).json({ error: 'Erro ao atualizar informações do funcionário', message });
    }
  }

  // Delete
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'ID do funcionário é obrigatório!' });

      await prisma.funcionario.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
        const message = formatError(error);
        return res.status(404).json({ error: 'Funcionário não encontrado!', message });
      }

      const message = formatError(error);
      return res.status(500).json({ error: 'Erro ao deletar funcionário!', message });
    }
  }
}

