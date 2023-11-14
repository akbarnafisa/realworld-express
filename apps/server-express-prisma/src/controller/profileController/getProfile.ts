import { RequestHandler } from 'express';
import { ResponseError, TokenPayload, profileViewer, responseFormat } from 'validator';
import userGetProfile from '../../utils/db/user/userGetProfile';

const getProfile: RequestHandler = async (request, res, next) => {
  try {
    const { username } = request.params;
    const auth = request?.auth as TokenPayload | undefined;

    const { data, following } = await userGetProfile(username, auth);

    if (!data) {
      throw new ResponseError(404, 'User not found!');
    }

    return res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: profileViewer(data, {
          following,
        }),
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default getProfile;
