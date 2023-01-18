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
    const highscore = parseInt(rawHighscore.substring(1, rawHighscore.length - 1))

    const [currentScore, setCurrentScore] = useState(0)
    const [errMsg, setErrMsg] = useState("")
    const [words, setWords] = useState([])
    const [currentWord, setCurrentWord] = useState("")
    var newWord = ""
    const [seenWords,setSeenWords] = useState([])

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

    const setNewWord = (word) => {
        newWord = word;
    }

    function randomInt(max) {
        return Math.floor(Math.random() * (max + 1))
    }

    const seenCheck = () => {
//        console.log(seenWords)
        var currentWordString = currentWord
        if (seenWords.includes(currentWordString)) {
            setCurrentScore(currentScore + 1)
        }
        else {
/*            console.log(seenWords)
            console.log(currentWord + " was not in")
            console.log(currentScore)
*/
            if (currentScore > highscore) {
                patchHighscore()
            }
            setCurrentScore(0)
            setSeenWords([])
        }
        currentWordString = ""
        setCurrentWord(words[randomInt(words.length - 1)].word)
    }

    const notSeenCheck = () => {
//        console.log(seenWords)
        var currentWordString = currentWord
        if (seenWords.includes(currentWordString)) {
/*            console.log(seenWords)
            console.log(currentWord + " was already in")
            console.log(currentScore)
*/
            if (currentScore > highscore) {
                patchHighscore()
            }
            setCurrentScore(0)
            setSeenWords([])            
        }
        else {
            setCurrentScore(currentScore + 1)
            setSeenWords([ ...seenWords, currentWord])
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
                        <h1>{currentWord}</h1>
                    </li>
                )}
                <li>
                    <button onClick={seenCheck}>already seen</button>
                </li>
                <li>
                    <button onClick={notSeenCheck}>new in this session</button>
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