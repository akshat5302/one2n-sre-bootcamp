const db = require('../src/api/v1/utils/database');

beforeAll(async () => {
  try {
    await db.authenticate();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  await db.close();
});