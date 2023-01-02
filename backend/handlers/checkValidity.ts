import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const checkValidity = async (req: Request, res: Response) => {
    console.log('Checking validity of guess: ');
    console.dir(req.body.guess);

    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'frankle';
    const collectionName = 'wordlist';

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);

        const foundWord = await db
            .collection(collectionName)
            .findOne({ word: req.body.guess });

        if (foundWord) {
            console.log('Valid guess');
            return res.status(200).json({ httpStatus: 200, data: true });
        } else {
            console.log('Invalid guess');
            return res.status(200).json({ httpStatus: 200, data: false });
        }
    } catch (error: any) {
        console.log('checkValidity caught error: ');
        console.log(error.message);

        return res.status(500).json({ httpStatus: 500, data: error.message });
    } finally {
        client.close();

        console.log('Disconnected.');
    }
};

export default checkValidity;
