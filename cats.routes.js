const express = require('express');
const cats = require('../controller/cats.controller');

const router = express.Router();



// * Get all posts
//router.get('/', users.findUserByEmail);

// * Get a single post
//GET ALL cats
router.get('/list', cats.getcats);
//GET SPECIFIC cat
router.get('/list/:catname', cats.getcats);

//GET ALL USER cats
router.get('/me/', cats.getUsercats);

//ADD SPECIFIC USER cat
router.post('/me/:catname', cats.postUsercat);

//GET SPECIFIC USER cat
router.get('/me/:catname', cats.getUsercats);

//DELETE SPECIFIC USER cat
router.delete('/me/:catname', cats.deleteUsercat);

//POST cat GRADE FOR USER
//router.post('/grade', cats.postcatGrade);

//GET GRADE FOR cats
//router.get('/grade', cats.getcatGrades);

//GET GRADING REQUESTS
router.post('/requests', cats.postGradeRequest); //SEND REQUEST
router.get('/requests', cats.getGradeRequests); //GET REQUESTS

module.exports = router;
