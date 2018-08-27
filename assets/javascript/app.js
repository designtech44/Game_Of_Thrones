var panel = $("#quiz-area");
var countStartNumber = 30;
// Question set
var questions = [{
  question: "Who is the Queen of  Kings Landing? ",
  answers: ["Cersei Lannister", "Kalesy", "The Red Queen", " Tyene Sand"],
  correctAnswer: "Cersei Lannister",
  image: "assets/images/queen-cersei.jpg"
}, {
  question: "Who is the Dragon Queen",
  answers: ["The Red Witch", "Olenna Tyrell", " Tyene Sand", "Daenerys Targaryen"],
  correctAnswer: "Daenerys Targaryen",
  image: "assets/images/dragon-queen.jpg"
}, {
  question: "To whom did little finger deliver Sansa to, after fleeing Westros",
  answers: ["king Joffrey", "Jamie Lannister", "Ramsay Bolton", "Ned Stark"],
  correctAnswer: "Ramsay Bolton",
  image: "assets/images/ramsay-bolton.jpg"
}, {
  question: "Who is named 'A Girl ' ",
  answers: ["Brienne", "Yara", "Arya Stark", "Melisandre"],
  correctAnswer: "Arya Stark",
  image: "assets/images/arya-stark.jpg"
}, {
  question: "Who is the Bastard King of the North",
  answers: ["Ned Stark", "Little Finger", "Joffrey", "Jon Snow"],
  correctAnswer: "Jon Snow",
  image: "assets/images/jon-Snow.jpg"
}, {
  question: "Who does Brienne of Tarth defeat",
  answers: ["Jamie Lannister", "Arya", "The Hound", "Bronn"],
  correctAnswer: "The Hound",
  image: "assets/images/the-hound.jpg"
}, {
  question: "Who was the boy king that jumped out of the Red Keep window?",
  answers: ["Joffrey", "Tommen Baratheon", "Arey", "little jon"],
  correctAnswer: "Tommen Baratheon",
  image: "assets/images/boy-king.jpg"
}, {
  question: "Who is the Hand of Daenerys Targaryen",
  answers: ["Missandei", "Grey Worm", "Tyrion Lannister", "Varys"],
  correctAnswer: "Tyrion Lannister",
  image: "assets/images/tyrion-lannister.png"
}];

// Variable to hold our setInterval
var timer;

var game = {

  questions: questions,
  currentQuestion: 0,
  counter: countStartNumber,
  correct: 0,
  incorrect: 0,

  countdown: function() {
    this.counter--;
    $("#counter-number").text(this.counter);
    if (this.counter === 0) {
      console.log("TIME UP");
      this.timeUp();
    }
  },
  loadQuestion: function() {

    timer = setInterval(this.countdown.bind(this), 1000);

    panel.html("<h2>" + questions[this.currentQuestion].question + "</h2>");

    for (var i = 0; i < questions[this.currentQuestion].answers.length; i++) {
      panel.append("<button class='answer-button' id='button' data-name='" + questions[this.currentQuestion].answers[i] + "'>" + questions[this.currentQuestion].answers[i] + "</button>");
    }
  },

  nextQuestion: function() {
    this.counter = window.countStartNumber;
    $("#counter-number").text(this.counter);
    this.currentQuestion++;
    this.loadQuestion.bind(this)();
  },

  timeUp: function() {

    clearInterval(window.timer);

    $("#counter-number").text(this.counter);

    panel.html("<h2>Out of Time!</h2>");
    panel.append("<h3>The Correct Answer is: " + questions[this.currentQuestion].correctAnswer);
    panel.append("<img src='" + questions[this.currentQuestion].image + "' />");

    if (this.currentQuestion === questions.length - 1) {
      setTimeout(this.results, 3 * 1000);
    }
    else {
      setTimeout(this.nextQuestion, 3 * 1000);
    }
  },

  results: function() {

    clearInterval(window.timer);

    panel.html("<h2>All done, here's how you did!</h2>");

    $("#counter-number").text(this.counter);

    panel.append("<h3>Correct Answers: " + this.correct + "</h3>");
    panel.append("<h3>Incorrect Answers: " + this.incorrect + "</h3>");
    panel.append("<h3>Unanswered: " + (questions.length - (this.incorrect + this.correct)) + "</h3>");
    panel.append("<br><button id='start-over'>Start Over?</button>");
  },

  clicked: function(e) {
    clearInterval(window.timer);
    if ($(e.target).attr("data-name") === questions[this.currentQuestion].correctAnswer) {
      this.answeredCorrectly();
    }
    else {
      this.answeredIncorrectly();
    }
  },

  answeredIncorrectly: function() {

    this.incorrect++;

    clearInterval(window.timer);

    panel.html("<h2>Nope!</h2>");
    panel.append("<h3>The Correct Answer is: " + questions[this.currentQuestion].correctAnswer + "</h3>");
    panel.append("<img src='" + questions[this.currentQuestion].image + "' />");

    if (this.currentQuestion === questions.length - 1) {
      setTimeout(this.results.bind(this), 3 * 1000);
    }
    else {
      setTimeout(this.nextQuestion.bind(this), 3 * 1000);
    }
  },

  answeredCorrectly: function() {

    clearInterval(window.timer);

    this.correct++;

    panel.html("<h2>Correct!</h2>");
    panel.append("<img src='" + questions[this.currentQuestion].image + "' />");

    if (this.currentQuestion === questions.length - 1) {
      setTimeout(this.results.bind(this), 3 * 1000);
    }
    else {
      setTimeout(this.nextQuestion.bind(this), 3 * 1000);
    }
  },

  reset: function() {
    this.currentQuestion = 0;
    this.counter = countStartNumber;
    this.correct = 0;
    this.incorrect = 0;
    this.loadQuestion();
  }
};

// CLICK EVENTS

$(document).on("click", "#start-over", game.reset.bind(game));

$(document).on("click", ".answer-button", function(e) {
  game.clicked.bind(game, e)();
});

$(document).on("click", "#start", function() {
  $("#sub-wrapper").prepend("<h2>Time Remaining: <span id='counter-number'>30</span> Seconds</h2>");
  game.loadQuestion.bind(game)();
});

// Create an AudioContext instance for this sound
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
// Create a buffer for the incoming sound content
var source = audioContext.createBufferSource();
// Create the XHR which will grab the audio contents
var request = new XMLHttpRequest();
// Set the audio file src here
request.open('GET', 'gott.mp3', true);
// Setting the responseType to arraybuffer sets up the audio decoding
request.responseType = 'arraybuffer';
request.onload = function() {
  // Decode the audio once the require is complete
  audioContext.decodeAudioData(request.response, function(buffer) {
    source.buffer = buffer;
    // Connect the audio to source (multiple audio buffers can be connected!)
    source.connect(audioContext.destination);
    // Simple setting for the buffer
    source.loop = true;
    // Play the sound!
    source.start(0);
  }, function(e) {
    console.log('Audio error! ', e);
  });
}
// Send the request which kicks off
request.send();
