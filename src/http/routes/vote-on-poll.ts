import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { prisma } from '../../lib/prisma';

import { z } from 'zod';
import { redis } from '../../lib/redis';

const VOTES_PER_PERSON = 1;

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

      if (userPreviousVotedOnPoll) {
        if (userPreviousVotedOnPoll.pollOptionId === pollOptionId) {
          return reply
            .status(400)
            .send({ message: 'You already voted on this poll.' });
        }

        await prisma.vote.delete({
          where: {
            id: userPreviousVotedOnPoll.id,
          },
        });

        await redis.zincrby(
          id,
          -VOTES_PER_PERSON,
          userPreviousVotedOnPoll.pollOptionId
        );
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

    await redis.zincrby(id, VOTES_PER_PERSON, pollOptionId);

    return reply.status(201).send();
  });
}
