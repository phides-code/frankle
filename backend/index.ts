import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import getWord from './handlers/getWord';
import getAllWords from './handlers/getAllWords';
import checkValidity from './handlers/checkValidity';
import getHighScores from './handlers/getHighScores';
import addHighScore from './handlers/addHighScore';

import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/api/getword', getWord);
app.get('/api/getallwords', getAllWords);
app.get('/api/gethighscores', getHighScores);
app.post('/api/addhighscore', addHighScore);
app.post('/api/checkvalidity', checkValidity);

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`*** Server is running on port ${port} ***`);
});
