import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para obter as informações do usuário
router.get('/api/user/me', auth, async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário obtido do token JWT
    const tipoUsuario = req.user.tipoUsuario; // Tipo de usuário obtido do token

    let user;

    // Verifica o tipo de usuário e busca na tabela correspondente
    if (tipoUsuario === 'aluno') {
      user = await prisma.Aluno.findUnique({
        where: { id: userId }
      });
    } else if (tipoUsuario === 'tutor') {
      user = await prisma.Tutor.findUnique({
        where: { id: userId }
      });
    } else {
      return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }

    // Se o usuário não for encontrado, retorna um erro
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user); // Retorna as informações do usuário
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar informações do usuário' });
  }
});

// Rota para atualizar as informações do usuário
router.put('/api/user/update', auth, async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário obtido do token JWT
    const tipoUsuario = req.user.tipoUsuario; // Tipo de usuário obtido do token
    const { nome, email, cpf } = req.body; // Dados que o usuário deseja atualizar

    let user;

    // Verifica o tipo de usuário e busca na tabela correspondente
    if (tipoUsuario === 'aluno') {
      user = await prisma.Aluno.findUnique({
        where: { id: userId }
      });
    } else if (tipoUsuario === 'tutor') {
      user = await prisma.Tutor.findUnique({
        where: { id: userId }
      });
    } else {
      return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }

    // Se o usuário não for encontrado, retorna um erro
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza as informações do usuário
    let updatedUser;
    if (tipoUsuario === 'aluno') {
      updatedUser = await prisma.Aluno.update({
        where: { id: userId },
        data: { nome, email, cpf }
      });
    } else if (tipoUsuario === 'tutor') {
      updatedUser = await prisma.Tutor.update({
        where: { id: userId },
        data: { nome, email, cpf }
      });
    }

    // Retorna o usuário atualizado como resposta
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar informações do usuário' });
  }
});


export default router;