const { Contact, User } = require('./dist/models');

async function cleanupOrphanedContacts() {
  try {
    console.log('🔍 Buscando contactos huérfanos...');
    
    // Buscar contactos donde el usuario o el contacto ya no existen
    const allContacts = await Contact.findAll({
      include: [
        {
          model: User,
          as: 'user',
          required: false
        },
        {
          model: User,
          as: 'contact',
          required: false
        }
      ]
    });

    console.log(`📊 Total de contactos encontrados: ${allContacts.length}`);

    let deletedCount = 0;
    
    for (const contact of allContacts) {
      // Si el usuario o el contacto no existen, eliminar la relación
      if (!contact.user || !contact.contact) {
        console.log(`🗑️ Eliminando contacto huérfano:`, {
          id: contact.id,
          userId: contact.userId,
          contactId: contact.contactId,
          userExists: !!contact.user,
          contactExists: !!contact.contact,
          status: contact.status
        });
        
        await contact.destroy();
        deletedCount++;
      }
    }

    console.log(`✅ Limpieza completada. Contactos eliminados: ${deletedCount}`);
    
    // Mostrar contactos restantes
    const remainingContacts = await Contact.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname']
        },
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'nickname']
        }
      ]
    });

    console.log(`📋 Contactos restantes: ${remainingContacts.length}`);
    remainingContacts.forEach(contact => {
      console.log(`  - ${contact.user?.nickname || 'Usuario eliminado'} ↔ ${contact.contact?.nickname || 'Contacto eliminado'} (${contact.status})`);
    });

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    process.exit(0);
  }
}

cleanupOrphanedContacts();
