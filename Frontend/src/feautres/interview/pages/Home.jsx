import React, {useState,useRef,useEffect} from "react";
import "../style/home.scss";
import {useInterview} from "../hooks/useInterview.js"
import { useNavigate } from "react-router";

const Home = () => {

    const {loading,generateReport,reports,getReports} = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()


    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        if (data) {
            navigate(`/interview/${data._id}`);
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
    
                <div className="loading-circle"></div>
    
                <p>Loading your interview plans...</p>
    
            </main>
        );
    }
    return (
        <main className="home">
            <section className="interview-container">

                {/* Header */}
                <div className="interview-header">
                    <h1>
                        Create Your Custom{" "}
                        <span>Interview Plan</span>
                    </h1>

                    <p>
                        Let our AI analyze the job requirements and your unique profile
                        to build a winning strategy.
                    </p>
                </div>


                {/* Main Form */}
                <div className="interview-card">

                    <div className="interview-input-group">

                        {/* LEFT SIDE */}
                        <div className="left">

                            <div className="section-title">
                                <span className="title-icon">▣</span>

                                <label htmlFor="jobDescription">
                                    Target Job Description
                                </label>

                                <span className="required">Required</span>
                            </div>

                            <div className="job-textarea-wrapper">
                                <textarea
                                    onChange={(e) => {
                                        setJobDescription(e.target.value)
                                    }}
                                    name="jobDescription"
                                    id="jobDescription"
                                    maxLength={5000}
                                    placeholder="Paste the full job description here... e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design."
                                />
                            </div>

                            <div className="character-count">
                            {jobDescription.length}  / 5000 characters
                            </div>

                        </div>


                        {/* RIGHT SIDE */}
                        <div className="right">

                            {/* Profile Title */}
                            <div className="profile-title">
                                <span className="profile-icon">♟</span>
                                <h3>Your Profile</h3>
                            </div>


                            {/* Resume Upload */}
                            <div className="input-group resume-group">

                                <label className="input-label">
                                    Upload Resume
                                    <span>PDF format</span>
                                </label>

                                <label className="resume-upload" htmlFor="resume">
                                    <div className="upload-icon">☁</div>

                                    <strong>Click to upload or drag & drop</strong>

                                    <small>PDF files up to 10MB</small>
                                </label>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    accept=".pdf"
                                />

                            </div>


                            <div className="divider">
                                <span>OR</span>
                            </div>


                            {/* Self Description */}
                            <div className="input-group self-description-group">

                                <label
                                    className="input-label"
                                    htmlFor="selfDescription"
                                >
                                    Quick Self-Description
                                </label>

                                <textarea
                                    onChange={(e) => {
                                        setSelfDescription(e.target.value)
                                    }}
                                    name="selfDescription"
                                    id="selfDescription"
                                    maxLength={5000}
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                />

                            </div>


                            {/* Info */}
                            <div className="info-box">
                                <span>ⓘ</span>

                                <p>
                                    Upload a Resume or fill Description is required to generate
                                    a personalized plan.
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Bottom */}
                    <div className="interview-footer">

                        <p className="privacy-text">
                            🔒 Your personal data is secure and private.
                        </p>

                        <button
                            onClick={handleGenerateReport}
                            className="button primary-button"
                            type="button"
                        >
                            ✨ Generate My Interview Strategy
                        </button>

                    </div>

                </div>


                {/* RECENT REPORTS - NOW BELOW THE INTERVIEW CARD */}
                {reports.length > 0 && (
                    <section className="recent-reports">

                        <h2>My Recent Interview Plans</h2>

                        <ul className="reports-list">

                            {reports.map((report) => (

                                <li
                                    key={report._id}
                                    className="report-item"
                                    onClick={() =>
                                        navigate(`/interview/${report._id}`)
                                    }
                                >

                                    <h3>
                                        {report.title || "Untitled Position"}
                                    </h3>

                                    <p className="report-meta">
                                        Generated on{" "}
                                        {new Date(
                                            report.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                    {/* ONLY ONE MATCH SCORE */}
                                    <p
                                        className={`match-score ${
                                            report.matchScore >= 80
                                                ? 'score--high'
                                                : report.matchScore >= 60
                                                ? 'score-mid'
                                                : 'score-low'
                                        }`}
                                    >
                                        Match Score: {report.matchScore ?? "N/A"}%
                                    </p>

                                </li>

                            ))}

                        </ul>

                    </section>
                )}


                {/* Bottom Links */}
                <div className="bottom-links">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Help Center</span>
                </div>

            </section>
        </main>
    );
};

export default Home;