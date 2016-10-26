(function() {

    'use strict'

    QuizzesController.$inject = ['QuizFactory', 'QuestionFactory']

    function QuizzesController(QuizFactory, QuestionFactory) {

        var vm = this;

        vm.messages = false
        vm.indexMode = true
        vm.createMode = false
        vm.editMode = false
        vm.quizzAdded = false

        // vm callable functions
        vm.activate = activate;
        vm.addQuiz = addQuiz;
        vm.createQuiz = createQuiz;
        vm.createQuestion = createQuestion;
        vm.editQuiz = editQuiz;

        // instatiated Functions
        activate();

        //  Defined Methods

        // *** INDEX PAGE DISPLAY ALL QUIZZES ***

        function getQuizzes() {
            return fetchQuizzes()
                .then(setQuizzes)
        }

        function fetchQuizzes() {
            // Fetch quizzes array from DB
            return QuizFactory.getQuizzes()
        }

        function setQuizzes(data) {
            // Set fetched quizzes objects array into vm.quizzes
            return vm.quizzes = data
        }

        // *** CREATE QUIZ ***

        function addQuiz() {
            // Switch from index mode to create mode
            vm.indexMode = false
            vm.createMode = true
        }

        function createQuiz() {
            // Create quiz in DB
            return QuizFactory.createQuiz(vm.newQuiz)
                // after creating a quiz get last quiz created
                .then(getCurrentQuiz)
        }

        function getCurrentQuiz() {
            return fetchQuizzes()
                .then(setCurrentQuiz)
        }

        function setCurrentQuiz(data) {
            // Clear vm.newQuiz
            vm.newQuiz = {};
            // Switch from create mode to edit mode (add questions)
            vm.createMode = false;
            vm.editMode = true;
            // Return last quiz created
            return vm.currentQuiz = data[data.length - 1]
        }

        function createQuestion() {
            // Set newQuestion quiz_id to last quiz created id
            vm.newQuestion.quiz_id = vm.currentQuiz.id;
            // Create question in DB
            return QuestionFactory.createQuestion(vm.newQuestion)
                .then(clearQuestion)
        }

        function clearQuestion() {
            // set messages to true
            vm.messages = true;
            // Clear newQuestion model
            vm.newQuestion = {};
            // set messages to false after 1 second
            setTimeout(function() {
                vm.messages = false
            }, 1000);
        }

        // *** ADD QUESTION ***

        function editQuiz(id) {
            // Set current quiz
            for (var i = 0; i < vm.quizzes.length; i++) {
                if (vm.quizzes[i].id === id) {
                    vm.currentQuiz = vm.quizzes[i];
                    // Activate edit mode
                    vm.indexMode = false
                    vm.editMode = true
                    window.scrollTo(0, 0);
                }
            }
        }

        function reset() {
            // Reset all settings to initial state
            vm.indexMode = true
            vm.createMode = false
            vm.editMode = false
            vm.quizzAdded = false;
            // Broadcast quiz has been initialize
            QuizFactory.finalize = false;
        }

        // On load Functions
        function activate() {
            window.scrollTo(0, 0);
            getQuizzes();
            reset();
        }

    }

    angular
        .module('app')
        .controller('QuizzesController', QuizzesController)

}());
