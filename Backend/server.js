require('dotenv').config()
const app = require('./src/app')
const {connectToDB} = require('./src/config/database')
// const {resume,selfDescription,jobDescription} = require("./src/services/temp")
// const generateInterviewReport = require("./src/services/ai.service")


const PORT = process.env.PORT || 3000;

connectToDB();
// generateInterviewReport({resume,selfDescription,jobDescription})

app.listen(PORT,() => {
    console.log(`Server Started at  Port : ${PORT}`)
})