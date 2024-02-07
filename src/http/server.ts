import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';

const app = fastify();

app.register(cookie, {
  secret: '38m589d89d53489d573-948dm',
  hook: 'onRequest',
});

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

const PORT = 3333;

app.listen({ port: PORT }, () => console.log(`Server running on port ${PORT}`));
