import { FastifyInstance } from 'fastify';

import { prisma } from '../../lib/prisma';

export async function getRecentPolls(app: FastifyInstance) {
  app.get('/polls', async (request, reply) => {
    const polls = await prisma.poll.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return reply.send(polls);
  });
}
