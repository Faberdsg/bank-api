const { Sequelize } = require('sequelize');

async function testConnection() {
  const NEON_HOST = 'ep-tiny-king-adzujavr-pooler.c-2.us-east-1.aws.neon.tech';
  const NEON_USERNAME = 'neondb_owner';
  const NEON_PASSWORD = 'npg_xirQ0qI8XdKM'; // La que termina en ...KM
  const NEON_DATABASE = 'neondb';

  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: NEON_HOST,
    port: 5432,
    username: NEON_USERNAME,
    password: NEON_PASSWORD,
    database: NEON_DATABASE,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necesario para NeonTech si no usas un certificado CA
      },
    },
    logging: console.log, // Usa console.log para ver la actividad de Sequelize
  });

  console.log('Intentando conectar a la base de datos NeonTech...');
  console.log(
    `Host: ${NEON_HOST}, User: ${NEON_USERNAME}, DB: ${NEON_DATABASE}`,
  );

  try {
    await sequelize.authenticate();
    console.log('🎉 ¡Conexión a la base de datos establecida correctamente!');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:');
    console.error('Mensaje de error:', error.message);
    // Imprimimos el stack completo para ver todos los detalles si es un error de conexión
    if (error instanceof Sequelize.ConnectionError) {
      console.error('Detalles del error de conexión (stack):', error);
    } else {
      console.error('Error general (stack):', error);
    }
  } finally {
    await sequelize.close();
  }
}

testConnection();
