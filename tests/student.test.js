const request = require('supertest');
const app = require('../src/server');
const Student = require('../src/api/v1/models/student');
const db = require('../src/api/v1/utils/database');

describe('Student API Routes', () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    await Student.destroy({ truncate: true, cascade: true });
  });

  const validStudent = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  describe('GET /', () => {
    beforeEach(async () => {
      await Student.bulkCreate([
        validStudent,
        {
          name: 'Jane Doe',
          email: 'jane.doe@example.com'
        }
      ]);
    });

    it('should return all students', async () => {
      const response = await request(app)
        .get('/api/v1/students')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });

    it('should return empty array when no students exist', async () => {
      await Student.destroy({ truncate: true });
      
      const response = await request(app)
        .get('/api/v1/students')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /:studentId', () => {
    it('should return a student by studentId', async () => {
      const student = await Student.create(validStudent);

      const response = await request(app)
        .get(`/api/v1/students/${student.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', student.id);
      expect(response.body).toHaveProperty('name', student.name);
      expect(response.body).toHaveProperty('email', student.email);
    });

    it('should return 404 for non-existent studentId', async () => {
      const response = await request(app)
        .get('/api/v1/students/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid studentId format', async () => {
      const response = await request(app)
        .get('/api/v1/students/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /', () => {
    it('should create a new student', async () => {
      const response = await request(app)
        .post('/api/v1/students')
        .send(validStudent)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', validStudent.name);
      expect(response.body).toHaveProperty('email', validStudent.email);
    });

    it('should handle missing data', async () => {
      const response = await request(app)
        .post('/api/v1/students')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid email format', async () => {
      const invalidStudent = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/v1/students')
        .send(invalidStudent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /:studentId', () => {
    let existingStudent;

    beforeEach(async () => {
      existingStudent = await Student.create(validStudent);
    });

    it('should update an existing student', async () => {
      const updatedData = {
        name: 'Jane Updated',
        email: 'jane.updated@example.com'
      };

      const response = await request(app)
        .put(`/api/v1/students/${existingStudent.id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toHaveProperty('id', existingStudent.id);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty('email', updatedData.email);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = {
        name: 'Jane Updated'
      };

      const response = await request(app)
        .put(`/api/v1/students/${existingStudent.id}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body).toHaveProperty('name', partialUpdate.name);
      expect(response.body).toHaveProperty('email', existingStudent.email);
    });

    it('should return 404 for non-existent studentId', async () => {
      const response = await request(app)
        .put('/api/v1/students/999')
        .send(validStudent)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /:studentId', () => {
    it('should delete an existing student', async () => {
      const student = await Student.create(validStudent);

      await request(app)
        .delete(`/api/v1/students/${student.id}`)
        .expect(200);

      // Verify student is deleted
      const deletedStudent = await Student.findByPk(student.id);
      expect(deletedStudent).toBeNull();
    });

    it('should return 404 for non-existent studentId', async () => {
      const response = await request(app)
        .delete('/api/v1/students/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid studentId format', async () => {
      const response = await request(app)
        .delete('/api/v1/students/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Simulate database connection error
      await db.close();

      const response = await request(app)
        .get('/api/v1/students')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      
      // Reconnect for other tests
      await db.authenticate();
    });

    it('should handle duplicate email addresses if unique constraint exists', async () => {
      await Student.create(validStudent);
      
      const response = await request(app)
        .post('/api/v1/students')
        .send(validStudent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
