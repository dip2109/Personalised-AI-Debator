import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import logo from "../assets/logonew1.jpg";
import lockIcon from "../assets/lock.svg";
import "./Debate.css";

const Debate = () => {
    const [messages, setMessages] = useState([]); // Stores chat history
    const synth = window.speechSynthesis;
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem("loggedIn") === "true";
        setIsLoggedIn(loggedInStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        if (!listening && transcript) {
            addUserMessage(transcript);
            sendToLLM(transcript);
        }
    }, [listening]);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1.0;
        synth.speak(utterance);
    };

    const sendToLLM = async (text) => {
        try {
            const res = await axios.post("http://localhost:8080/chat/", { text });
            addAIMessage(res.data.response);
            speakText(res.data.response);
        } catch (error) {
            console.error("Error fetching AI response:", error);
        }
    };

    const addUserMessage = (text) => {
        setMessages((prevMessages) => [...prevMessages, { text, sender: "user" }]);
    };

    const addAIMessage = (text) => {
        setMessages((prevMessages) => [...prevMessages, { text, sender: "ai" }]);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleButtonClick = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            synth.cancel();
            SpeechRecognition.startListening();
        }
    };


    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <>
            <div className="navbar">
                <div className="abc">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="nav-links">
                    <ul>
                        <li><Link to="home" smooth={true} duration={800}>Home</Link></li>
                        <li><Link to="about" smooth={true} duration={800}>About</Link></li>
                        <li><Link to="features" smooth={true} duration={800} offset={-80}>Features</Link></li>
                        <li><Link to="contactus" smooth={true} duration={800}>Contact Us</Link></li>
                    </ul>
                </div>
                <div className="nav-buttons">
                    {isLoggedIn ? (
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <button className="login-button" onClick={() => navigate('/login')}>
                                <img src={lockIcon} alt="Login Icon" /> Login
                            </button>
                            <button className="signup-button" onClick={() => navigate('/register')}>Sign Up</button>
                        </>
                    )}
                </div>
            </div>

            {/* Debate Chat UI */}
            <div className="debate-container">
                <h1 className="debate-title">Hey Buddy...Let's Start Your Debate</h1>

                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <button onClick={handleButtonClick} className={`speech-button ${listening ? "stop" : "start"}`}>
                    {listening ? "Stop Listening" : "Start Talking"}
                </button>
            </div>
        </>
    );
};

export default Debate;
