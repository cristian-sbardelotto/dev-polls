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

    if (sessionId) {
      const userPreviousVotedOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId: id,
          },
        },
      });

      if (
        userPreviousVotedOnPoll &&
        userPreviousVotedOnPoll.pollOptionId !== pollOptionId
      ) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVotedOnPoll.id,
          },
        });
      } else if (userPreviousVotedOnPoll) {
        return reply
          .status(400)
          .send({ message: 'You already voted on this poll.' });
      }
    }

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

    await prisma.vote.create({
      data: {
        sessionId,
        pollId: id,
        pollOptionId,
      },
    });

    return reply.status(201).send();
  });
}
