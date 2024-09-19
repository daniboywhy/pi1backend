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
  



export default router;