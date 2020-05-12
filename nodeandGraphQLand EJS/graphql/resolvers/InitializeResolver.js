class InitializeController {
    index() {
        return {
            applicationVersion: '1.2'
        }
    }
};

const initialize = new InitializeController();
module.exports = initialize;