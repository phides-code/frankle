import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;
const HIGHSCORES_API_KEY = process.env.HIGHSCORES_API_KEY as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

interface HighScore {
    name: string;
    time: number;
    word: string;
}

const addHighScore = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'frankle';
    const collectionName = 'highscores';

    const { encryptedHighScoreString } = req.body;
    const decryptedHighScore = CryptoJS.AES.decrypt(
        encryptedHighScoreString,
        HIGHSCORES_API_KEY
    );
    const decryptedHighScoreString = decryptedHighScore.toString(
        CryptoJS.enc.Utf8
    );
    const newHighScore = JSON.parse(decryptedHighScoreString);

    // Type assertion
    if (
        typeof newHighScore !== 'object' ||
        (newHighScore as HighScore).name === undefined ||
        (newHighScore as HighScore).time === undefined ||
        (newHighScore as HighScore).word === undefined
    ) {
        // The value is not an object with a 'name', 'time', and 'word' property.
        return res.status(400).json({
            httpStatus: 400,
            data: 'Bad request',
        });
    }

    console.log('adding new high score: ');
    console.log(newHighScore);

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB: ' + dbName);

        const resultOfInsert = await db
            .collection(collectionName)
            .insertOne(newHighScore);

        console.log('got resultOfInsert: ');
        console.log(resultOfInsert);
        console.log('Added to high scores list');

        return res.status(200).json({
            httpStatus: 201,
            data: 'OK',
        });
    } catch (err: any) {
        console.log('addHighScore caught error: ');
        console.log(err.message);
        return res.status(500).json({
            httpStatus: 500,
            data: err.message,
        });
    } finally {
        client.close();

        console.log('Disconnected.');
    }
};

export default addHighScore;
