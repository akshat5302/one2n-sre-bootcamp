const router = require('express').Router();
const studentController = require('../controllers/studentController');
const healthController = require('../controllers/healthController');

// CRUD Routes /students
router.get('/', studentController.getStudents); // /students
router.get('/:studentId', studentController.getStudent); // /students/:studentId
router.post('/', studentController.createStudent); // /students
router.put('/:studentId', studentController.updateStudent); // /students/:studentId
router.delete('/:studentId', studentController.deleteStudent); // /students/:studentId

module.exports = router;
