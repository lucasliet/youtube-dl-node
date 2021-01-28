import express from 'express'
import path from 'path';
import controller from './controller';

const routes = express.Router();

routes.use('/output', express.static(path.resolve(__dirname, '..', 'output')));
routes.get('/list', controller.listFiles);

routes.get('/', controller.welcome)
routes.post('/', controller.downloadMusic);

export default routes;