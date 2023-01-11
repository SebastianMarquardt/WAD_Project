import React from 'react';
import { useEffect, useState } from 'react'
import Axios from 'axios';
import './Words.css'

function Words() {

    const [words, setWords] = useState([])
    const [newWord, setNewWord] = useState("")
    const [correctedWord, setCorrectedWord] = useState("")
    const [errMsg, setErrMsg] = useState("");

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
                window.location.reload(false);
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

    const deleteWord = async (word) => {
        try {
            await Axios.delete("http://localhost:8081/words/deleteWord", {
                params: {
                    word: word,
                }
            })
            window.location.reload(false);
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else {
                setErrMsg("Word not found")
            }
        };
    }

    const putWord = async (wrongWord) => {
        try {
            await Axios.put("http://localhost:8081/words/putCorrect", null, {
                params: {
                    wrongWord: wrongWord,
                    newWord: correctedWord
                }
            })
            window.location.reload(false);
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg("Word does already exist");
            } else {
                setErrMsg("Word not found")
            }
        };
    }

    return (
        <div>
            <ul id='addWord'>
                <li><input type="text" onChange={(e) => {
                    setNewWord(e.target.value)
                }} ></input></li>
                <li>
                    <button onClick={addWord}>Add new word</button>
                </li>
            </ul>
            <p>{errMsg}</p>
            {words.length > 0 && (
                <ul id='wordList'>
                    {words.map(word => (
                        <li key={word.word}>
                            <h1>{word.word}</h1>
                            <button onClick={() => deleteWord(word.word)}>Delete</button>
                            <input type="text" onChange={(e) => {
                                setCorrectedWord(e.target.value)
                            }} placeholder={word.word}></input>
                            <button onClick={() => putWord(word.word)}>Correct word</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Words;