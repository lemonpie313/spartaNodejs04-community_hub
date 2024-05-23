import { prisma } from '../utils/prisma/index.js';

export default async function (req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    // req.user에 사용자 정보를 저장합니다.
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message ?? '비정상적인 요청입니다.' });
  }
}
