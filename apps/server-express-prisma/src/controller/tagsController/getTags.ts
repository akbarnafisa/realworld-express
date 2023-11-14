import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { responseFormat, tagsViewer } from 'validator';
import prisma from '../../utils/db/prisma';

const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.tags.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      skip: 0,
      take: 10,
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
    });

    return res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: tagsViewer(data),
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default getTags;
