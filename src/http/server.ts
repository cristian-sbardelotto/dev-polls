import fastify from 'fastify';
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import { pollResults } from './websocket/poll-results';

const app = fastify();

app.register(cookie, {
  secret: '38m589d89d53489d573-948dm',
  hook: 'onRequest',
});

app.register(websocket);

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.register(pollResults);

const PORT = 3333;

app.listen({ port: PORT }, () => console.log(`Server running on port ${PORT}`));
