import { resolve } from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import SurveysRepository from '../repositories/SurveysRepository';
import SurveysUsersRepository from '../repositories/SurveysUsersRepository';
import UsersRepository from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const existingUser = await usersRepository.findOne({ where: { email } });

    if (!existingUser) {
      return response.status(400).json({ error: 'User does not exists' });
    }

    const existingSurvey = await surveysRepository.findOne(survey_id);

    if (!existingSurvey) {
      return response.status(400).json({ error: 'Survey does not exists' });
    }



    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserExists = await surveysUsersRepository.findOne(
      {
        where:
        {
          user_id: existingUser.id,
          value: null
        },
        relations: ['user', 'survey']
      });

    const variables = {
      nome: existingUser.name,
      title: existingSurvey.title,
      description: existingSurvey.description,
      id: '',
      link: process.env.URL_MAIL
    }

    if (surveyUserExists) {
      variables.id  = surveyUserExists.id;
      await SendMailService.execute(email, existingSurvey.title, variables, npsPath);
      return response.json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: existingUser.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailService.execute(
      email, existingSurvey.title, variables, npsPath
    );

    return response.json(surveyUser);
  }

}

export default SendMailController;