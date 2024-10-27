const Student = require('../models/student');

// CRUD Controllers

// get all Students
exports.getStudents = (req, res, next) => {
  Student.findAll()
    .then((students) => {
      res.status(200).json({ students });
    })
    .catch((err) => console.log(err));
};

// get student by id
exports.getStudent = (req, res, next) => {
  const { studentId } = req.params;
  Student.findByPk(studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: 'student not found!' });
      }
      res.status(200).json({ student });
    })
    .catch((err) => console.log(err));
};

// create student
exports.createStudent = (req, res, next) => {
  const { name } = req.body;
  const { email } = req.body;
  Student.create({
    name,
    email,
  })
    .then((result) => {
      console.log('Created student');
      res.status(201).json({
        message: 'Student created successfully!',
        Student: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// update student
exports.updateStudent = (req, res, next) => {
  const { studentId } = req.params;
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  Student.findByPk(studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: 'Student not found!' });
      }
      student.name = updatedName;
      student.email = updatedEmail;
      return student.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Student updated!', student: result });
    })
    .catch((err) => console.log(err));
};

// delete student
exports.deleteStudent = (req, res, next) => {
  const { studentId } = req.params;
  Student.findByPk(studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: 'Student not found!' });
      }
      return Student.destroy({
        where: {
          id: studentId,
        },
      });
    })
    .then((result) => {
      res.status(200).json({ message: 'Student deleted!' });
    })
    .catch((err) => console.log(err));
};
