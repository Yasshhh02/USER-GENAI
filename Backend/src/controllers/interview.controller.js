const pdfParse = require("pdf-parse")
const {generateInterviewReport , generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req,res) {
    const resumeFile = req.file

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const{selfDescription,jobDescription} = req.body;

    const interViewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })
    console.log("AI REPORT:");
    console.log(JSON.stringify(interViewReportByAi, null, 2));
    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })
    res.status(201).json({
        message:"Interview report generated successfully",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function generateInterViewReportByIdController(req,res){
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId , user:req.user.id})

    if(!interviewReport){
        return res.status(400).json({
            message:"Interview report not found.",
        })
    }
    return res.status(201).json({
        message:"Interview report fetched successfully.",
        interviewReport
    })
}

/**
 * @description Controller to get all interview reports of logged in user.
 */

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({
                user: req.user.id
            })
            .sort({
                createdAt: -1
            })
            .select(
                "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preprationPlan"
            );

        return res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });

    } catch (error) {
        console.log("GET ALL REPORTS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch interview reports"
        });
    }
}
/**
*@description Controller to generate resume PDF based on user self description, resume and job description.
*/
async function generateResumedfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        console.log("PDF REQUEST ID:", interviewReportId);
        console.log("USER ID:", req.user.id);

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        console.log("GENERATING PDF...");

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        });

        console.log("PDF GENERATED SUCCESSFULLY");

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF GENERATION ERROR:", error);

        return res.status(500).json({
            message: "Failed to generate resume PDF",
            error: error.message
        });
    }
}
module.exports = {generateInterViewReportController,
    generateInterViewReportByIdController,
    getAllInterviewReportsController,
    generateResumedfController
}