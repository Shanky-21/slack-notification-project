// validators.js
const { logger } = require('./logger');
const { VALIDATION } = require('./config');

function validateTeam(team) {
    if (!team || !team.teamID) {
        logger.info(`[EmailOrchestrator] Skipping: Invalid team data`, {
            team: team ? "exists" : "null",
            teamID: team?.teamID,
        });
        return false;
    }
    return true;
}

function validateEmail(email, team) {
    if (!email) {
        logger.info(`[EmailOrchestrator] Skipping: Email is null`, {
            teamID: team.teamID,
        });
        return false;
    }

    const missingFields = VALIDATION.REQUIRED_EMAIL_FIELDS.filter(
        field => !email[field]
    );

    if (missingFields.length > 0) {
        logger.info(`[EmailOrchestrator] Skipping: Malformed email`, {
            teamID: team.teamID,
            missingFields,
            emailId: email._id,
        });
        return false;
    }

    return true;
}

module.exports = {
    validateTeam,
    validateEmail
};