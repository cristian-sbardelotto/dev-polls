import { FastifyInstance } from 'fastify';

import { prisma } from '../../lib/prisma';

import { z } from 'zod';

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:id/votes', async (request, reply) => {
    const bodySchema = z.object({
      pollOptionId: z.string().uuid(),
    });

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { pollOptionId } = bodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);

    return reply.status(201).send({});
  });
}
