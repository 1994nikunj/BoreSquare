import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema.js';
import resolvers from './resolver.js';
import redis from 'redis';

const app = express();

const redisClient = redis.createClient();
redisClient.connect().then(() => {
	// console.log('Connected to Redis');
});

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: () => ({ redisClient })
});


async function startServer() {
	await server.start();
	server.applyMiddleware({ app });

	// start the server
	app.listen({ port: 4000 }, () =>
		console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
	);
}

startServer();