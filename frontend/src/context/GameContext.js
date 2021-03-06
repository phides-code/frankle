import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
const CryptoJS = require('crypto-js');

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [toggleReset, setToggleReset] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [currentWord, setCurrentWord] = useState(null);
    const [currentRowNumber, setCurrentRowNumber] = useState(0);
    const [currentLetterPosition, setCurrentLetterPosition] = useState(0);
    const [guesses, setGuesses] = useState([]);
    const { user, isAuthenticated } = useContext(UserContext);
    const wordLength = 5;
    const numOfGuessRows = 5;

    const decryptWord = (hashedWord) => {
        return CryptoJS.AES.decrypt(hashedWord, 'banana').toString(
            CryptoJS.enc.Utf8
        );
    };

    const saveGame = async (lastGuess) => {
        const deHashedWord = decryptWord(currentWord);
        const gameStatus = {
            gameWon,
            gameOver,
            userId: isAuthenticated ? user.email : 'localuser',
            word: currentWord,
            onRow: currentRowNumber + 1,
            guesses: [...guesses, lastGuess],
        };

        if (lastGuess === deHashedWord) {
            setGameWon(true);
            setGameOver(true);
            gameStatus.gameWon = true;
            gameStatus.gameOver = true;
        } else if (currentRowNumber === numOfGuessRows - 1) {
            setGameOver(true);
            gameStatus.gameOver = true;
        }

        if (isAuthenticated) {
            const res = await fetch('/api/savegame', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameStatus),
            });
            const saveGameResponse = await res.json();
            console.log(
                `got saveGameResponse.message: ${saveGameResponse.message}`
            );
        }
    };

    const getRandomWord = async () => {
        const res = await fetch('/api/randomword');
        const randomWordResponse = await res.json();

        setCurrentWord(randomWordResponse.randomWord);
    };

    const deleteGame = async () => {
        const res = await fetch('/api/deletegame', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.email,
                word: currentWord,
            }),
        });

        const deleteGameResponse = await res.json();
        console.log(
            `got deleteGameResponse.message: ${deleteGameResponse.message}`
        );
    };

    const resetGame = () => {
        for (let i = 0; i < numOfGuessRows; i++) {
            for (let j = 0; j < wordLength; j++) {
                const letterBox = document.getElementById(`${i}-${j}`);

                letterBox.classList.remove(
                    'rightPosition',
                    'wrongPosition',
                    'badLetter'
                );
                letterBox.innerText = '';
            }
        }

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < alphabet.length; i++) {
            document
                .getElementById(alphabet[i])
                .classList.remove(
                    'rightPosition',
                    'wrongPosition',
                    'badLetter'
                );
        }

        if (!gameOver && isAuthenticated) {
            deleteGame();
        }

        setGameOver(false);
        setGameWon(false);
        getRandomWord();
        setGuesses([]);
        setCurrentRowNumber(0);
        setCurrentLetterPosition(0);
        setToggleReset(!toggleReset);
    };

    const colorize = (guess, answer, rowNumber) => {
        const deHashedWord = decryptWord(answer);

        for (let i = 0; i < wordLength; i++) {
            const letterBox = document.getElementById(`${rowNumber}-${i}`);
            const keyboardKey = document.getElementById(guess[i]);
            letterBox.innerText = guess[i];

            if (guess[i] === deHashedWord[i]) {
                letterBox.classList.add('rightPosition');
                keyboardKey.classList.remove('wrongPosition');
                keyboardKey.classList.add('rightPosition');
            } else if (deHashedWord.includes(guess[i])) {
                letterBox.classList.add('wrongPosition');
                keyboardKey.classList.add('wrongPosition');
            } else {
                letterBox.classList.add('badLetter');
                keyboardKey.classList.add('badLetter');
            }
        }
    };

    useEffect(() => {
        const checkForGameInProgress = async () => {
            if (isAuthenticated) {
                const res = await fetch('/api/loadgame', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.email }),
                });
                const fetchResult = await res.json();
                return fetchResult.gameInProgress;
            } else {
                return 'none';
            }
        };

        const loadGame = (gameInProgress) => {
            setCurrentWord(gameInProgress.word);
            setGuesses(gameInProgress.guesses);

            // Loop through array of guesses from the gameInProgress
            for (let i = 0; i < gameInProgress.guesses.length; i++) {
                colorize(
                    gameInProgress.guesses[i], // guess
                    gameInProgress.word, // answer
                    i // rowNumber
                );
            }

            setCurrentRowNumber(gameInProgress.onRow);
        };

        const startGame = async () => {
            const gameInProgress = await checkForGameInProgress();
            if (gameInProgress === 'none') {
                console.log('no resumable game, getting random word...');
                getRandomWord();
            } else {
                console.log('resuming game in progress... ');
                loadGame(gameInProgress);
            }
        };

        startGame();
    }, [isAuthenticated, user?.email, toggleReset]);

    return (
        <GameContext.Provider
            value={{
                currentWord,
                setCurrentWord,
                gameOver,
                setGameOver,
                gameWon,
                setGameWon,
                wordLength,
                numOfGuessRows,
                currentRowNumber,
                setCurrentRowNumber,
                currentLetterPosition,
                setCurrentLetterPosition,
                saveGame,
                guesses,
                setGuesses,
                setToggleReset,
                resetGame,
                colorize,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
