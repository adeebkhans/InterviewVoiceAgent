function extractNoticePeriod(transcript) {
    // Implement regex or NLP logic to extract notice period
    const match = transcript.match(/(\d+)\s*(days?|months?)/i);
    return match ? match[0] : null; // Return the matched notice period
}

function extractCTC(transcript) {
    // Implement regex or NLP logic to extract CTC
    const match = transcript.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null; // Return the matched CTC
}

function extractAvailability(transcript) {
    // Implement regex or NLP logic to extract availability
    const match = transcript.match(/(next\s+\w+|tomorrow|today)/i);
    return match ? match[0] : null; // Return the matched availability
}

module.exports = {
    extractNoticePeriod,
    extractCTC,
    extractAvailability
}; 