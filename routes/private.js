import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/listar-usuarios', async (req, res) => {
    try{
        const users = await prisma.user.findMany()

        res.status(200).json({message: "Users:", users})
    } catch(err){
        res.status(500).json({message: "Server Error"})
    }
})

// Backend: Rota protegida para obter o usuário logado
router.get('/api/user/me', auth, async (req, res) => {
    try {
      // Obtem o ID do usuário a partir do token JWT
      const userId = req.user.id; // O middleware authenticateToken decodifica o token e anexa o ID ao req.user
      const user = await prisma.Aluno.findUnique({
        where: { id: userId }
      });
          // Se o usuário não for encontrado, retorna um erro
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(user); // Retorna as informações do usuário
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Erro ao buscar informações do usuário' });
    }
  });
  

  router.put('/api/user/update', auth, async (req, res) => {
    try {
      const userId = req.user.id; // O ID do usuário obtido do middleware de autenticação
      const { nome, email, cpf } = req.body; // Dados que o usuário deseja atualizar
  
      // Verifica se o usuário existe no banco de dados
      const user = await prisma.Aluno.findUnique({
        where: { id: userId }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Atualiza as informações do usuário
      const updatedUser = await prisma.Aluno.update({
        where: { id: userId },
        data: {
          nome,
          email,
          cpf
        }
      });
  
      // Retorna o usuário atualizado como resposta
      res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar informações do usuário' });
    }
  });

export default router;