import express, { Request,  Response}  from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import { connectToDatabase, disconnectFromDatabase } from './utils/database';
import logger from './utils/logger';
import routes from './routes';

const PORT = process.env.PORT || 4003;

const app = express();

app.use(express.json( { limit: '100mb' } ));
app.use(cors());
app.use(helmet( {
    contentSecurityPolicy: false,
}));

const server = app.listen(PORT, async () => {
    await connectToDatabase();
    logger.info(`Server Listening on port ${PORT}`);

    routes(app);
    }
);

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!');
});

const signals: Array<string> = ['SIGINT', 'SIGTERM'];

function gracefullyShutdown(signal: string) {
    process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down...`);
        await server.close();

        // Disconnect from database
        await disconnectFromDatabase();

        logger.info('Server closed, my work here is done.');
        process.exit(0);
    })
}

for(let i=0; i < signals.length; i++) {
    gracefullyShutdown(signals[i]);
}
