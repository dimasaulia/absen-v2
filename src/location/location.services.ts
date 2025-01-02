import { Context } from 'hono';
import { prisma } from '../providers/database.providers';
import { LocationResponse } from './location.model';
import { HTTPException } from 'hono/http-exception';
import { use } from 'hono/jsx';
import { UserData, UserResponse } from '../user/user.model';

export class LocationService {
  static async getUserLocation(c: Context): Promise<LocationResponse[]> {
    try {
      const userData = c.get('userData') as UserData;
      const locations: LocationResponse[] = [];

      const userLocations = await prisma.location.findMany({
        where: { OR: [{ user_id: userData.user_id }, { user_id: null }] },
      });

      for (let i = 0; i < userLocations.length; i++) {
        const location = userLocations[i];
        locations.push({
          location_id: location.location_id,
          name: location.name,
          lokasi: location.lokasi,
          alamat: location.alamat,
          state: location.state,
          provinsi: location.provinsi,
        });
      }

      return locations;
    } catch (error) {
      throw new HTTPException(500, {
        message: String(error),
      });
    }
  }
}
