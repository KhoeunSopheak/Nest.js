import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource
  ) {}

  create(createUserDto: CreateUserDto) {
    return "";
  }

  findAll() {
    const query = `SELECT * FROM users`;
    return this.datasource.query(query);
  }

  async registerUser(first_name: string, last_name: string, email: string, password: string) {
    const query = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id as "userId", first_name as "first_name", last_name as "last_name", email, password;
    `;

    const values = [first_name, last_name, email, password];

    try {
      const result = await this.datasource.query(query, values);
      
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new Error('Failed to insert user - No data returned');
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findAllUsers() {
    const query = 'SELECT user_id as "userId", first_name as "first_name", last_name as "last_name", email, password FROM users';
    const result = await this.datasource.query(query);
    return result;
  }
}
