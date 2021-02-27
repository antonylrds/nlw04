import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {
  async create(request: Request, response: Response) {
    const {name, email} = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email('Formato de email é inválido').required('Email é obrigatório'),
    });

    /* if (!(await schema.isValid(request.body))) {
      return response.status(400).json({error: 'Validation Failed'})
    } */

    try {
      await schema.validate(request.body, {abortEarly: false});
    } catch (err) {
      return response.status(400).json({error: err.errors})
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userExists = await usersRepository.findOne({where: {email}});


    if(userExists) {
      return response.status(400).json({error: 'Email already in use'});
    }

    const user = usersRepository.create({
      name,
      email
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export default UserController;