import React from "react";
import "./Navbar.css"
import { Link } from "react-router-dom";

function Navbar() {
    if (localStorage.getItem('name') == null) {
        localStorage.setItem('name', JSON.stringify(""));
    }
    var rawName = localStorage.getItem('name')
    var storedName = rawName.substring(1, rawName.length - 1)

    if (storedName === 'admin')
    return (
        <nav>
            <ul id="NavbarUL">
                <li id="NavbarLI">
                    <Link to="/" id="NavbarLI">Play</Link>
                </li>
                <li id="NavbarLI">
                    <Link to="/login" id="NavbarLI">Login/Register</Link>
                </li>
                <li id="NavbarLI">
                    <Link to="/words" id="NavbarLI">Edit Words</Link>
                </li>
                <li id="NavbarLI">
                    <Link to="/users" id="NavbarLI">Edit Users</Link>
                </li>
                <li id="NavbarUser">
                    <p>Hello, {storedName}</p>
                </li>
            </ul>
        </nav>
    );
    else
    return (
        <nav>
            <ul id="NavbarUL">
                <li id="NavbarLI">
                    <Link to="/" id="NavbarLI">Play</Link>
                </li>
                <li id="NavbarLI">
                    <Link to="/login" id="NavbarLI">Login/Register</Link>
                </li>
                <li id="NavbarUser">
                    <p>Hello, {storedName}</p>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;