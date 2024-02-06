import { FastifyInstance } from 'fastify';

import { prisma } from '../../lib/prisma';

import { z } from 'zod';

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:id', async (request, reply) => {
    const requestSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = requestSchema.parse(request.params);

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

    if (!poll) {
      return reply.status(400).send({ error: "Poll didn't exist" });
    }

    return reply.send({ poll });
  });
}
