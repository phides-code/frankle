import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import getWord from './handlers/getWord';
import getAllWords from './handlers/getAllWords';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/api/getword', getWord);
app.get('/api/getallwords', getAllWords);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
