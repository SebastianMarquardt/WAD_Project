import React from 'react';
import { useEffect, useState } from 'react'
import Axios from 'axios';
import './Users.css'

function Users() {

    const [users, setUsers] = useState([])
    const [errMsg, setErrMsg] = useState("");
    const [highscore, setHighscore] = useState(0);

    const fetchData = () => {
        fetch("http://localhost:8080/login/getAllUsers")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("NETWORK RESPONSE ERROR");
                }
            })
            .then(data => {
                setUsers(data)
            })
            .catch((error) => console.error("FETCH ERROR:", error));
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteUser = async (user) => {
        if (window.confirm(`Are you sure, you want to delete ${user}?`) === false) {
            return;
        }
        try {
            await Axios.delete("http://localhost:8080/login/deleteUser", {
                params: {
                    name: user,
                }
            })
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

    const patchHighscore = async (user) => {
        try {
            await Axios.patch("http://localhost:8080/login/patchHighscore", null, {
                params: {
                    name: user,
                    newHighscore: highscore,
                }
            })
            if ("\"" + user + "\"" === localStorage.getItem('name')) {
                localStorage.setItem('highscore', JSON.stringify(`${highscore}`))
            }
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
        <div>
            {users.length > 0 && (
                <ul id='userList'>
                    {users.map(user => (
                        <li key={user.name} id='userItem'>
                            <ul id='userItems'>
                                <li></li><h1>{user.name}</h1>
                                <li><button onClick={() => deleteUser(user.name)}>Delete</button></li>
                                <li><input type="number" onChange={(e) => {
                                    setHighscore(e.target.value)
                                }} ></input></li>
                                <li><button onClick={() => patchHighscore(user.name)}>Patch Highscore</button></li>
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
            <p>{errMsg}</p>
        </div>
    )
}

export default Users;