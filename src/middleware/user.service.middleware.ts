import { prisma } from '../providers/database.providers';
import { UserData, UserResponse } from '../user/user.model';

export class UserServiceMiddleware {
  static async verifyUser(u: UserResponse): Promise<UserData | null> {
    const user = await prisma.user.findUnique({
      select: {
        user_id: true,
        username: true,
        email: true,
        password: true,
        full_name: true,
        provider: true,
        job_id: true,
        role: {
          select: {
            name: true,
          },
        },
      },
      where: {
        username: u.username,
      },
    });

    if (!user) return null;

    const userData: UserData = {
      user_id: user.user_id,
      username: user.username,
      name: user.full_name,
      role: user.role.name,
      job_id: user.job_id,
    };

    return userData;
  }
}
