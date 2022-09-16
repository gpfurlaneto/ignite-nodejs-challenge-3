import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
        .where("lower(games.title) LIKE :param", { param: `%${param.toLowerCase()}%` })
        .getMany()

  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(*) as count from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder()
      .leftJoinAndSelect('Game.users', 'users')
      .where("Game.id = :id", { id })
      .getOne() as Game
      
    return game.users
  }
}
