import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { code } from '@/lib/code';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { votes } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: 'Kamu harus login terlebih dahulu' });
    return;
  }

  // Create New
  if (req.method === 'POST') {
    const voteData = {
      candidates: req.body.candidates,
      endDateTime: req.body.endDate,
      startDateTime: req.body.startDate,
      title: req.body.title,
      publisher: req.body.publisher,
      code: code(6),
      deletedAt: null,
    };

    const result = await prisma.votes.create({
      data: voteData,
    });
    return res.json(result);
  }

  //Get all by user
  if (req.method === 'GET') {
    const result = await prisma.votes.findMany({
      where: {
        AND: [
          {
            deletedAt: null,
          },
          {
            publisher: session.user.email,
          },
        ],
      },
    });

    const response = {
      status: 200,
      data: result,
    };
    return res.json(response);
  }

  //update by code
  // Update Votes
  else if (req.method === 'PUT') {
    const result = await prisma.votes.update({
      where: {
        code: req.body.code,
      },
      data: {
        candidates: req.body.candidates,
        endDateTime: req.body.endDate,
        startDateTime: req.body.startDate,
        title: req.body.title,
      },
    });

    return res.json(result);
  }

  return res.status(400).json('Method not allowed.');
}
