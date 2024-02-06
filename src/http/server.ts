import fastify from 'fastify';
import { createPoll } from './routes/create-poll';

const app = fastify();

app.register(createPoll);

app.listen({ port: 3333 }, () => console.log('listening on port 3333'));
