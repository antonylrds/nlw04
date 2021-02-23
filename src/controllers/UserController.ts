import {Request, Response} from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

class UserController {
  async create(request: Request, response: Response) {
    const {name, email} = request.body;

    const usersRepository = getRepository(User);

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