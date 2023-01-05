import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const addNewHighScore = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'frankle';
    const collectionName = 'highscores';

    const newHighScore = req.body;

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
        console.log('addNewHighScore caught error: ');
        console.log(err.message);
        return res.status(200).json({
            httpStatus: 500,
            data: err.message,
        });
    } finally {
        client.close();

        console.log('Disconnected.');
    }
};

export default addNewHighScore;

// curl -X POST -H "Content-Type: application/json" -d '{"name": "Joe", "time": 59869, "word": "SHARD"}' htts://localhost:8000/api/addnewhighscore
