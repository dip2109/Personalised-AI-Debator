import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, animateScroll as scroll } from 'react-scroll';
import './Home.css';
// import logo from "../assets/logo.png";
import logo from "../assets/logonew1.jpg";
import lockIcon from "../assets/lock.svg";
import contactSVG from '../assets/undraw_hello_ccwj (1).svg';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
// import ParticleBackground from './ParticleBackground';



const Home = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('loggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll(".scroll-effect");
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    el.classList.add("show");
                }
            });
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        query: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        alert("Your query has been submitted!");
        setFormData({ name: '', email: '', query: '' });
    };

    return (
        <div>
            {/* __________________________Navbar___________________________ */}
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

            {/*__________________________________ Home Section_________________________ */}
            <div id="home about" className="home-container scroll-effect">
                <p className="home-title">ArguBuddy</p>
                <h1 className="home-subtitle">Engage, Argue, and Evolve with the Future of AI Debates.</h1>
                <p className="home-description">Enhance your critical thinking and articulation with AI-driven, real-time, and interactive discussions.</p>
                <button className="home-button" onClick={() => navigate("/debate")}>
                    Start Debate
                </button>
            </div>

            {/* ___________________________________Features Section_____________________________ */}
            <div id="features" className="features-section scroll-effect">
                <h1 className="features-title">Key Features</h1>
                <p className="features-description">Practice structured debates that enhance logical analysis, rebuttal skills, and decision-making.</p>
                <div className="features-grid">
                    {[
                        { title: "Personalized Debates", description: "AI adapts to your knowledge, debate style, and previous discussions to create truly tailored interactions. It learns from your inputs, refines its arguments, and aligns with your level of expertise." },
                        { title: "Voice & Text Interaction", description: "Engage effortlessly using both speech and text formats, making debates more immersive and intuitive. Seamlessly switch between modes to practice articulation and written argumentation." },
                        { title: "Real-Time Knowledge Integration", description: "AI continuously retrieves and incorporates the latest facts, policies, and news to keep arguments relevant. Stay ahead with an evolving database that ensures dynamic and fact-based debates." },
                        { title: "Multi-Perspective Analysis", description: "Get well-rounded arguments by exploring diverse viewpoints across various ideologies and disciplines. This feature enhances critical thinking and allows users to consider all sides of a discussion." },
                        { title: "Adaptive Learning", description: "AI refines responses based on past interactions, feedback loops, and evolving debate styles. The system grows smarter with every debate, ensuring progressive learning and skill enhancement." },
                        { title: "Exam & Interview Preparation", description: "Enhance reasoning, articulation, and rebuttal skills to excel in competitive exams and job interviews. Simulate real-world discussions and prepare effectively with structured and challenging debates." },
                    ].map((feature, index) => (
                        <div key={index} className="feature-card scroll-effect">
                            <h2 className="feature-title">{feature.title}</h2>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* ______________________________CONTACT SECTION____________________________ */}
            <div id="contactus" className="contact-container scroll-effect">
                <div className="contact-wrapper">

                    {/* Left Side: Contact Form */}
                    <div className="contact-form">
                        <h2 className="contact-title">Contact Us</h2>
                        <p className="contact-description">We’d love to hear from you! Send us your query below.</p>

                        <form onSubmit={handleSubmit} className="form">
                            {/* Name Input */}
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                    className="input-field"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="input-field"
                                />
                            </div>

                            {/* Query Input */}
                            <div className="form-group">
                                <label>Your Query</label>
                                <textarea
                                    name="query"
                                    value={formData.query}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your query here..."
                                    className="input-textarea"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="submit-button">
                                Submit Query
                            </button>
                        </form>
                    </div>

                    {/* Right Side: SVG Image */}
                    <div className="contact-image">
                        <img src={contactSVG} alt="Contact Us" />
                    </div>

                </div>
            </div>


            {/*-------------------FOOTER------------------------  */}
            <footer className="footer">
                <div className="footer-container">

                    {/* Left Section - About */}
                    <div className="footer-section about">
                        <h3>About DebateAI</h3>
                        <p>
                            DebateAI is an interactive platform where users can engage in AI-driven debates.
                            Share your thoughts, challenge ideas, and get real-time, insightful responses powered by advanced AI models.
                        </p>
                    </div>

                    {/* Middle Section - Quick Links */}
                    <div className="footer-section links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/debate">Start a Debate</a></li>
                            <li><a id="about">About Us</a></li>
                            <li id="contactus"><a>Contact</a></li>
                        </ul>
                    </div>

                    {/* Right Section - Social Media */}
                    <div className="footer-section social">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="#"><FaFacebookF /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaLinkedinIn /></a>
                            <a href="#"><FaInstagram /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="footer-bottom">
                    © {new Date().getFullYear()} DebateAI. All rights reserved.
                </div>
            </footer>

        </div>
    );
};

export default Home;
