import React from 'react';
import './Play.css'
import { useState } from 'react'
import Axios from 'axios';

function Play() {

    const [newWord, setNewWord] = useState("")
    const [errMsg, setErrMsg] = useState("");

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

    return (
        <div id='introDiv'>
            <ul>
                <li><h1>
                    Try to differentiate between new words, and words you've already seen
                </h1>
                    <button>
                        Start
                    </button></li>
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