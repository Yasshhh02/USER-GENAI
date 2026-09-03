const { GoogleGenAI } = require('@google/genai');
const puppeteer = require('puppeteer');


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description:
                "A score between 0 and 100 indicating how well the candidate matches the job description"
        },

        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    },
                    intention: {
                        type: "string"
                    },
                    answer: {
                        type: "string"
                    }
                },
                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    },
                    intention: {
                        type: "string"
                    },
                    answer: {
                        type: "string"
                    }
                },
                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: {
                        type: "string"
                    },

                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"]
                    }
                },
                required: [
                    "skill",
                    "severity"
                ]
            }
        },

        preprationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "number"
                    },

                    focus: {
                        type: "string"
                    },

                    tasks: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: [
                    "day",
                    "focus",
                    "tasks"
                ]
            }
        },

        title: {
            type: "string",
            description:
                "The title of the job for which the interview report is generated"
        }
    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preprationPlan",
        "title"
    ]
};


async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate an interview preparation report based ONLY on the information below.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

You MUST return:

- title of the job
- matchScore between 0 and 100
- 5 technicalQuestions
- 5 behavioralQuestions
- relevant skillGaps
- a 7-day preprationPlan

IMPORTANT:
Return data strictly according to the provided JSON schema.
Do not return fields such as candidateDetails, appliedRole,
evaluationSummary, contact, skillsMatch, or overallRecommendation.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    });

    console.log("RAW AI RESPONSE:");
    console.log(response.text);

    return JSON.parse(response.text);
}
async function generatePdfFromHtml(htmlContent) {
    let browser;

    try {
        console.log("STARTING PDF GENERATION");

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ]
        });

        console.log("BROWSER LAUNCHED");

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        });

        console.log("HTML SET");

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            }
        });

        console.log("PDF GENERATED");

        return Buffer.from(pdfBuffer);

    } catch (error) {
        console.error("PDF GENERATION ERROR:", error);
        throw error;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = {
        type: "object",

        properties: {
            html: {
                type: "string",
                description:
                    "Complete professional HTML resume that can be converted to PDF using Puppeteer"
            }
        },

        required: ["html"]
    };


    const prompt = `
Generate a professional resume for the candidate using the information below.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Create a professional and well-structured resume.

IMPORTANT:
Return the response strictly according to the provided JSON schema.

The html field must contain complete HTML with styling that can be converted into a PDF using Puppeteer.

The content of resume should not be sound like it's generated by AI and should be as close as possible to real human-written resume.

Make sure that the Content that is generated it should be along A4 paper and its doesnt go outside from its boundary and make sure there will be some margin along all the four sides of paper so that the content that is generated is much visible and realistic for presentation 

You can highlight the content using some colors or different font style but the overall design should be simple and professional

The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.

The resume should not be so lengthy, it should ideally 1-2 page long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant informations that can increase the candidates chance for getting call for the given job description.
`;


    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema
        }
    });


    console.log("RAW RESUME RESPONSE:");
    console.log(response.text);


    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}


module.exports = {generateInterviewReport , generateResumePdf};