import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import SurveysRepository from '../repositories/SurveysRepository';
import SurveysUsersRepository from '../repositories/SurveysUsersRepository';
import UsersRepository from '../repositories/UsersRepository';

class SendMailController {

  async execute(request: Request, response: Response) {
    const {email, survey_id} = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const existingUser = await usersRepository.findOne({where: {email}});

    if (!existingUser) {
      return response.status(400).json({error: 'User does not exists'});
    }

    const surveyExists = await surveysRepository.findOne(survey_id);

    if (!surveyExists) {
      return response.status(400).json({error: 'Survey does not exists'});
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: existingUser.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }

}

export default SendMailController