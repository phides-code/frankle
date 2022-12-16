import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import getWord from './handlers/getWord';
import getAllWords from './handlers/getAllWords';
import checkValidity from './handlers/checkValidity';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/api/getword', getWord);
app.get('/api/getallwords', getAllWords);
app.post('/api/checkValidity', checkValidity);

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`*** Server is running on port ${port} ***`);
});
