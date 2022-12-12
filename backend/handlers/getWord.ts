import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const getWord = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'frankle';
    const collectionName = 'wordlist';

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB: ' + dbName);

        const allWords = await db.collection(collectionName).find().toArray();

        const randomWord =
            allWords[Math.floor(Math.random() * allWords.length)].word;

        console.log('returning random word: ');
        console.log(randomWord);

        return res.status(200).json({
            status: 200,
            data: randomWord,
        });
    } catch (error: any) {
        console.log('getWord caught error: ');
        console.log(error.message);
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default getWord;
