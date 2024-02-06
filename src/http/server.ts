import fastify from 'fastify';

const app = fastify();

app.get('/', (req, rep) => {
  rep.send(JSON.stringify('hello world!'));
});

app.listen({ port: 3333 }, () => console.log('listening on port 3333'));
