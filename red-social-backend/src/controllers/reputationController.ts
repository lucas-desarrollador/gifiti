import { Request, Response } from 'express';
import { ReputationVote, User } from '../models';

// Obtener estadísticas de reputación de un usuario
export const getUserReputation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Contar votos positivos
    const positiveVotes = await ReputationVote.count({
      where: {
        toUserId: userId,
        type: 'positive'
      }
    });

    // Contar votos negativos
    const negativeVotes = await ReputationVote.count({
      where: {
        toUserId: userId,
        type: 'negative'
      }
    });

    res.json({
      success: true,
      data: {
        userId: parseInt(userId),
        positiveVotes,
        negativeVotes,
        totalVotes: positiveVotes + negativeVotes
      }
    });
  } catch (error) {
    console.error('Error al obtener reputación del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Agregar un voto de reputación
export const addReputationVote = async (req: Request, res: Response) => {
  try {
    const { toUserId, type, promiseId } = req.body;
    const fromUserId = (req as any).user.id;

    // Validaciones
    if (!toUserId || !type) {
      return res.status(400).json({
        success: false,
        message: 'toUserId y type son requeridos'
      });
    }

    if (type !== 'positive' && type !== 'negative') {
      return res.status(400).json({
        success: false,
        message: 'type debe ser "positive" o "negative"'
      });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes votarte a ti mismo'
      });
    }

    // Verificar si el usuario ya votó por esta promesa
    if (promiseId) {
      const existingVote = await ReputationVote.findOne({
        where: {
          fromUserId,
          toUserId,
          promiseId
        }
      });

      if (existingVote) {
        return res.status(400).json({
          success: false,
          message: 'Ya has votado por esta promesa'
        });
      }
    }

    // Crear el voto
    const vote = await ReputationVote.create({
      fromUserId,
      toUserId,
      type,
      promiseId
    });

    res.json({
      success: true,
      data: vote,
      message: `Voto ${type === 'positive' ? 'positivo' : 'negativo'} agregado exitosamente`
    });
  } catch (error) {
    console.error('Error al agregar voto de reputación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener historial de votos de un usuario
export const getUserVoteHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await ReputationVote.findAndCountAll({
      where: {
        toUserId: userId
      },
      include: [
        {
          model: User,
          as: 'votesGiven',
          attributes: ['id', 'nickname', 'profileImage']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        votes: rows,
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener historial de votos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};


