import fastify from 'fastify';
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';

const app = fastify();

app.register(createPoll);
app.register(getPoll);

app.listen({ port: 3333 }, () => console.log('listening on port 3333'));
