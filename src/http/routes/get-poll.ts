import { FastifyInstance } from 'fastify';

import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';

import { z } from 'zod';

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const result = await redis.zrange(id, 0, -1, 'WITHSCORES');

    const votes = result.reduce((obj, item, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1];

        Object.assign(obj, {
          [item]: +score,
        });
      }

      return obj;
    }, {} as Record<string, number>);

    return reply.send({
      poll: {
        id: poll?.id,
        title: poll?.title,
        options: poll?.options.map(option => {
          return {
            id: option.id,
            title: option.title,
            votes: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
  });
}
