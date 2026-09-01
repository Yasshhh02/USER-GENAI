# USER-GENAI

USER-GENAI is a full-stack interview preparation platform powered by artificial intelligence which I created in order to enable users to prepare for job interviews in a more personal manner.

The application produces interview-related material such as interview strategies, questions, a skill analysis, roadmaps, and reports by using the user's resume or self-description and the job description of the position they wish to apply for.

## About the Project

It can be difficult to get ready for interviews since different job positions call for different skills and different kinds of preparation.

The aim when I developed USER-GENAI was to make interview preparation more personalized; rather than applying the same preparation approach to all positions, users are allowed to give details about themselves and the job they want.

The application then produces personalized content for interview preparation.

## Features

- User registration and login
- Authentication using JWT
- Protected routes
- Upload resume/details for interview analysis
- Add target job description
- Generate personalized interview preparation
- Generate interview questions
- Skill analysis
- Personalized learning roadmap
- Generate interview reports
- View previously generated reports

## Tech Stack

### Frontend

- React.js
- Vite
- SCSS
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Project Structure

```text
USER-GENAI
│
├── Backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── services
│   │
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── features
│   │   │   ├── auth
│   │   │   └── interview
│   │   │
│   │   ├── hooks
│   │   └── styles
│   │
│   └── package.json
│
└── .gitignore
