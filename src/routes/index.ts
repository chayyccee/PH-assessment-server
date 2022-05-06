import { Express } from 'express';
import { callbackController } from '../controllers/callback';
import { userLogin } from '../controllers/login';
import { userRefreshToken } from '../controllers/refreshToken';
import { LibraryController } from '../controllers/library';

const routes = (app: Express) => {

    app.get('/login', userLogin);
    app.get('/callback', callbackController);
    app.get('/refresh_token', userRefreshToken);
    app.post('/library/:id', LibraryController);
}

export default routes;
