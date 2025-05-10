import { Context } from 'hono';
import { logger } from '../providers/logging.providers';
import { createWriteStream, promises as fsPromises } from 'fs';
import path from 'path';
import { UserData } from '../user/user.model';
import { ImageStorage } from './image.model';
import { Prisma as IPrisma } from '../../node_modules/.prisma/client/index';
import sharp from 'sharp';
import { prisma } from '../providers/database.providers';

export class ImageService {
  static async uploadImage(c: Context): Promise<[boolean, any]> {
    try {
      const body = await c.req.parseBody({ all: true });
      const userData: UserData = await c.get('userData');
      const imagePairList: Record<string, ImageStorage> = {};
      let imageProcess = 0;

      for (const key in body) {
        if (
          Object.prototype.hasOwnProperty.call(body, key) &&
          key.startsWith('file')
        ) {
          const file = body[key] as File;
          const fileOriName = file.name;
          const fileName = crypto.randomUUID();
          const fileType =
            file.type.split('/').length > 1 ? file.type.split('/')[1] : '';
          if (['png', 'jpg', 'jpeg'].includes(fileType) == false) {
            logger.warn(
              `[image.service.ts]: skipe file "${file.name}" beacuse format not supported`
            );
            continue;
          }

          const fileArrayBuffer = await file.arrayBuffer();
          const fileBuffer = Buffer.from(fileArrayBuffer);
          const outputDir = `./src/public/img/storage/${userData.username}`;
          await fsPromises.mkdir(outputDir, { recursive: true });
          const hiResFilePath = path.join(
            outputDir,
            `${fileName}-high.${fileType}`
          );
          const lowResFilePath = path.join(
            outputDir,
            `${fileName}-low.${fileType}`
          );

          const hiRes = await sharp(fileBuffer).resize(2000).toBuffer();
          const lowRes = await sharp(fileBuffer).resize(300).toBuffer();
          createWriteStream(hiResFilePath).write(hiRes);
          createWriteStream(lowResFilePath).write(lowRes);

          const pairName = key.split('_').slice(0, 2).join('');
          if (!imagePairList.hasOwnProperty(pairName)) {
            if (key.includes('clockin')) {
              imagePairList[pairName] = {
                originalClockInFileName: fileOriName,
                hiresClockInFileName: hiResFilePath,
                lowresClockInFileName: lowResFilePath,
              };
            }

            if (key.includes('clockout')) {
              imagePairList[pairName] = {
                originalClockOutFileName: fileOriName,
                hiresClockOutFileName: hiResFilePath,
                lowresClockOutFileName: lowResFilePath,
              };
            }
          } else {
            if (key.includes('clockin')) {
              imagePairList[pairName].originalClockInFileName = fileOriName;
              imagePairList[pairName].hiresClockInFileName = hiResFilePath;
              imagePairList[pairName].lowresClockInFileName = lowResFilePath;
            }

            if (key.includes('clockout')) {
              imagePairList[pairName].originalClockOutFileName = fileOriName;
              imagePairList[pairName].hiresClockOutFileName = hiResFilePath;
              imagePairList[pairName].lowresClockOutFileName = lowResFilePath;
            }
          }

          imageProcess++;
        }
      }

      const bulkData: IPrisma.ImagePairCreateManyInput[] = [];
      for (const key in imagePairList) {
        if (Object.prototype.hasOwnProperty.call(imagePairList, key)) {
          const image = imagePairList[key];
          bulkData.push({
            user_id: userData.user_id,
            hi_res_clockin_path: image.hiresClockInFileName?.replace('src', ''),
            hi_res_clockout_path: image.hiresClockOutFileName?.replace(
              'src',
              ''
            ),
            low_res_clockin_path: image.lowresClockInFileName?.replace(
              'src',
              ''
            ),
            low_res_clockout_path: image.lowresClockOutFileName?.replace(
              'src',
              ''
            ),
          });
        }
      }

      await prisma.imagePair.createMany({ data: bulkData });

      return [true, `Sukses Menyimpan ${imageProcess} Data`];
    } catch (error) {
      logger.error(`error in image.service.ts, detail: ${error}`);
      return [false, error];
    }
  }
}
