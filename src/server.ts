import express from 'express';
import cors from 'cors';
import routes from './routes';

export const port = process.env.PORT || 3333;
export const baseUrl = process.env.NODE_ENV === 'production' ? 'https://youtube-dl-node.herokuapp.com' : 'http://localhost'

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(port,
  () => console.log(`💻  Server is running at ${baseUrl}:${port}/`));