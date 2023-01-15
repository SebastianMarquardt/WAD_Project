import React from 'react';
import './Play.css'
import { useState, useEffect } from 'react'
import Axios from 'axios';

function Play() {

    if (localStorage.getItem('highscore') == null) {
        localStorage.setItem('highscore', JSON.stringify("0"));
    }
    const highscore = localStorage.getItem('highscore')

    const [currentScore, setCurrentScore] = useState(0)
    const [newWord, setNewWord] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [words, setWords] = useState([])

    const fetchData = () => {
        fetch("http://localhost:8081/words/getAll")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("NETWORK RESPONSE ERROR");
                }
            })
            .then(data => {
                setWords(data)
            })
            .catch((error) => console.error("FETCH ERROR:", error));
    }

    useEffect(() => {
        fetchData()
    }, [])

    const addWord = async () => {
        if (newWord.length > 2) {
            try {
                await Axios.post("http://localhost:8081/words/postNewWord", null, {
                    params: {
                        word: newWord,
                    }
                })
                setErrMsg("New word set")
            }
            catch (err) {
                if (!err?.response) {
                    setErrMsg("No Server Response");
                } else if (err.response?.status === 409) {
                    setErrMsg("Word does already exist");
                }
            };
        } else {
            setErrMsg("Word must be longer than two characters");
        }
    }

    function randomInt(max) {
        return Math.floor(Math.random() * (max + 1))
    }

    return (
        <div id='introDiv'>
            <ul>
                <li>
                    <h1>
                        Try to differentiate between new words, and words you've already seen
                    </h1>
                </li>
                <li>
                    <h2>
                        Highscore: {highscore}
                    </h2>
                </li>
                <li>
                    <h2>
                        current Score: {currentScore}
                    </h2>
                </li>
            </ul>
            <ul>
                {words.length > 0 && (
                    <li>
                        <h1>{
                            words[randomInt(words.length - 1)].word
                        }</h1>
                    </li>
                )}
                <li>
                    <button>already seen</button>
                </li>
                <li>
                    <button>new in this session</button>
                </li>
            </ul>
            <ul id='addWord'>
                <p>{errMsg}</p>
                <li><input type="text" onChange={(e) => {
                    setNewWord(e.target.value)
                }} ></input></li>
                <li>
                    <button onClick={addWord}>Add new word</button>
                </li>
            </ul></div>
    );
}

export default Play;