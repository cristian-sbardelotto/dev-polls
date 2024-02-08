import { FastifyInstance } from 'fastify';

import { z } from 'zod';

import { voting } from '../../utils/voting-pub-sub';

export async function pollResults(app: FastifyInstance) {
  app.get(
    '/polls/:id/results',
    { websocket: true },
    async (connection, request) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      voting.subscribe(id, message => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}
