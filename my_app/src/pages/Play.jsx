import React from 'react';
import './Play.css'
import { useState, useEffect } from 'react'
import Axios from 'axios';

function Play() {

    if (localStorage.getItem('name') == null) {
        localStorage.setItem('name', JSON.stringify(""));
    }
    if (localStorage.getItem('highscore') == null) {
        localStorage.setItem('highscore', JSON.stringify("0"));
    }
    var rawName = localStorage.getItem('name')
    var name = rawName.substring(1, rawName.length - 1)
    const rawHighscore = localStorage.getItem('highscore')
    var highscore = parseInt(rawHighscore)
    if (rawHighscore.charAt(0) === "\"") {
        highscore = parseInt(rawHighscore.substring(1, rawHighscore.length - 1))
    }
    const [currentScore, setCurrentScore] = useState(0)
    const [errMsg, setErrMsg] = useState("")
    const [words, setWords] = useState([])
    const [currentWord, setCurrentWord] = useState("")
    const [newWord, setNewWord] = useState("")
    const [seenWords, setSeenWords] = useState([])
    const [scoreColor, setScoreColor] = useState("#393E46")

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
                setCurrentWord(data[randomInt(data.length - 1)].word)
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

    const seenCheck = () => {
        var currentWordString = currentWord
        if (seenWords.includes(currentWordString)) {
            setCurrentScore(currentScore + 1)
            setScoreColor("#393E46")
        }
        else {
            if (currentScore > highscore) {
                patchHighscore()
            }
            setCurrentScore(0)
            setSeenWords([])
            setScoreColor("red")
        }
        currentWordString = ""
        setCurrentWord(words[randomInt(words.length - 1)].word)
    }

    const notSeenCheck = () => {
        var currentWordString = currentWord
        if (seenWords.includes(currentWordString)) {
            if (currentScore > highscore) {
                patchHighscore()
            }
            setCurrentScore(0)
            setSeenWords([])
            setScoreColor("red")
        }
        else {
            setCurrentScore(currentScore + 1)
            setSeenWords([...seenWords, currentWord])
            setScoreColor("#393E46")
        }
        currentWordString = ""
        setCurrentWord(words[randomInt(words.length - 1)].word)
    }

    const patchHighscore = async () => {
        try {
            await Axios.patch("http://localhost:8080/login/patchHighscore", null, {
                params: {
                    name: name,
                    newHighscore: currentScore,
                }
            })
            localStorage.setItem('highscore', JSON.stringify(`${currentScore}`))
            window.location.reload(false);
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else {
                setErrMsg("User not found")
            }
        };
    }

    return (
        <div id='playDiv'>
            <ul id='scoreUl'>
                <li id='scoreLi'>
                    <h2>
                        Highscore: {highscore}
                    </h2>
                </li>
                <li id='scoreLi'>
                    <h2 style={{color: scoreColor}}>
                        current Score: {currentScore}
                    </h2>
                </li>
            </ul>
            {words.length > 0 && (
                <h1 id='currentWord'>{currentWord}</h1>
            )}
            <ul id='gameButtons'>
                <li>
                    <button id='checkButton' onClick={seenCheck}>Already seen</button>
                </li>
                <li>
                    <button id='checkButton' onClick={notSeenCheck}>New in this session</button>
                </li>
            </ul>
            <h1 id='gameInfo'>
                Try to differentiate between new words, and words you've already seen
            </h1>
            <h1 id='gameInfo'>
                Suggest new words:
            </h1>
            <ul id='addWord'>
                <ul id='addWordNoErr'>
                    <li><input id='addWordInput' type="text" onChange={(e) => {
                        setNewWord(e.target.value)
                    }} ></input></li>
                    <li>
                        <button id='addWordButton' onClick={addWord}>Add new word</button>
                    </li>
                </ul>
                <li><p>{errMsg}</p></li>
            </ul></div>
    );
}

export default Play;