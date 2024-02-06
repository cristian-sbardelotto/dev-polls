import { randomUUID } from 'node:crypto';

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

    let { sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: ONE_MONTH_IN_SECONDS,
        signed: true,
        httpOnly: true,
      });
    }

    return reply.status(201).send({ sessionId });
  });
}
