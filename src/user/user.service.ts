import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getOrCreateUser(auth0User: any) {
    const authId = auth0User.sub;

    console.log('Auth0 user:', auth0User);
    console.log('Creating or finding user with authId:', auth0User.sub);

    const user = await this.databaseService.user.upsert({
      where: { authId },
      update: {},
      create: {
        authId,
        name: auth0User.name || 'Unnamed',
        email: auth0User.email || `${auth0User.sub}@placeholder.com`,
      },
    });

    return user;
  }
}
