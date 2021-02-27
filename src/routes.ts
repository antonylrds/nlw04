import {Router} from 'express';
import UserController from './controllers/UserController';
import SurveyController from './controllers/SurveyController';
import SendMailController from './controllers/SendMailController';
import AnswerController from './controllers/AnswerController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();

router.post('/users', userController.create);

router.get('/surveys', surveyController.show);
router.post('/surveys', surveyController.create);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

export default router;