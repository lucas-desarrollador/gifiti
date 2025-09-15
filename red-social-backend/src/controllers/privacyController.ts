import { Request, Response } from 'express';
import { PrivacySettings } from '../models';

export const getPrivacySettings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Buscar configuraciones existentes o crear las por defecto
    let privacySettings = await PrivacySettings.findOne({
      where: { userId: user.id }
    });

    if (!privacySettings) {
      // Crear configuraciones por defecto si no existen
      privacySettings = await PrivacySettings.create({
        userId: user.id,
        showAge: true,
        showEmail: false,
        showAllWishes: false,
        showContactsList: false,
        showMutualFriends: true,
        showLocation: true,
        showPostalAddress: false,
        isPublicProfile: true,
      });
    }

    res.json({
      success: true,
      data: privacySettings
    });
  } catch (error) {
    console.error('Error al obtener configuraciones de privacidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updatePrivacySettings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const {
      showAge,
      showEmail,
      showAllWishes,
      showContactsList,
      showMutualFriends,
      showLocation,
      showPostalAddress,
      isPublicProfile
    } = req.body;

    // Buscar configuraciones existentes o crear nuevas
    let privacySettings = await PrivacySettings.findOne({
      where: { userId: user.id }
    });

    if (privacySettings) {
      // Actualizar configuraciones existentes
      await privacySettings.update({
        showAge,
        showEmail,
        showAllWishes,
        showContactsList,
        showMutualFriends,
        showLocation,
        showPostalAddress,
        isPublicProfile
      });
    } else {
      // Crear nuevas configuraciones
      privacySettings = await PrivacySettings.create({
        userId: user.id,
        showAge,
        showEmail,
        showAllWishes,
        showContactsList,
        showMutualFriends,
        showLocation,
        showPostalAddress,
        isPublicProfile
      });
    }

    res.json({
      success: true,
      data: privacySettings,
      message: 'Configuraciones de privacidad actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar configuraciones de privacidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
