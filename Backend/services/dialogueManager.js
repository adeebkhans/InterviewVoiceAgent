class DialogueManager {
    constructor() {
        this.questions = [
            { question: "Are you interested in this role?", key: "interest" },
            { question: "What is your current notice period?", key: "notice_period" },
            { question: "What is your current and expected CTC?", key: "ctc" },
            { question: "When are you available for an interview?", key: "availability" }
        ];
        this.currentQuestionIndex = 0;
    }

    getNextQuestion() {
        if (this.currentQuestionIndex < this.questions.length) {
            return this.questions[this.currentQuestionIndex++].question;
        } else {
            return null; // No more questions
        }
    }

    reset() {
        this.currentQuestionIndex = 0; // Reset to the first question
    }
}

module.exports = new DialogueManager(); 