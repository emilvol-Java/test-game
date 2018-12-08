exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
    var players          = new Array();
    var places           = new Array(6);
    var purses           = new Array(6);
    var inPenaltyBox     = new Array(6);

    var popQuestions     = new Array();
    var scienceQuestions = new Array();
    var sportsQuestions  = new Array();
    var rockQuestions    = new Array();

    var currentPlayer    = 0;
    var isGettingOutOfPenaltyBox = false;

    var didPlayerNotWin = function(){
      return (purses[currentPlayer] !== 6);
    }

    var currentCategory = function(){
      if([0,4,8].includes(places[currentPlayer])){
        return 'Pop';
      }
      if([1,5,9].includes(places[currentPlayer])){
        return 'Science';
      }
      if([2,6,10].includes(places[currentPlayer])){
        return 'Sports';
      }
      return 'Rock';
    };


    for(var i = 0; i < 50; i++){
      popQuestions.push("Pop Question "+i);
      scienceQuestions.push("Science Question "+i);
      sportsQuestions.push("Sports Question "+i);
      rockQuestions.push("Rock Question "+i);
    }

    this.isPlayable = function(howManyPlayers){
      return howManyPlayers >= 2;
    };

    this.add = function(playerName){
      players.push(playerName);
      places[this.howManyPlayers() - 1] = 0;
      purses[this.howManyPlayers() - 1] = 0;
      inPenaltyBox[this.howManyPlayers() - 1] = false;

      console.log(playerName + " was added");
      console.log("This is player number: " + players.length);

      return true;
    };

    this.howManyPlayers = function(){
      return players.length;
    };


    var askQuestion = function(){
      var categoryMap = { 'Pop' : popQuestions, 'Science' : scienceQuestions, 'Sports' : sportsQuestions, 'Rock' : rockQuestions };
      console.log(categoryMap[currentCategory()].shift());
    };

    this.roll = function(roll){
      console.log(players[currentPlayer] + " is the current player");
      console.log(players[currentPlayer] + " has rolled a " + roll);

      if(inPenaltyBox[currentPlayer]){
        if(roll % 2 != 0){
          isGettingOutOfPenaltyBox = true;

          console.log(players[currentPlayer] + " is getting out of the penalty box");
          places[currentPlayer] = places[currentPlayer] + roll;
          if(places[currentPlayer] > 11){
            places[currentPlayer] = places[currentPlayer] - 12;
          }

          console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
          console.log("The category is " + currentCategory());
          askQuestion();
        }else{
          console.log(players[currentPlayer] + " is not getting out of the penalty box");
          isGettingOutOfPenaltyBox = false;
        }
      }else{

        places[currentPlayer] = places[currentPlayer] + roll;
        if(places[currentPlayer] > 11){
          places[currentPlayer] = places[currentPlayer] - 12;
        }

        console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
        console.log("The category is " + currentCategory());
        askQuestion();
      }
    };

    this.wasCorrectlyAnswered = function(){
      if(inPenaltyBox[currentPlayer]){
        if(isGettingOutOfPenaltyBox){
          console.log('Answer was correct!!!!');
          purses[currentPlayer] += 1;
          var str = (purses[currentPlayer] > 1) ? (players[currentPlayer] + " now has " + purses[currentPlayer]  + " Gold Coins.") : (players[currentPlayer] + " now has " + purses[currentPlayer]  + " Gold Coin.");
          console.log(str);

          var notAWinner = didPlayerNotWin();
          currentPlayer += 1;
          if(currentPlayer == players.length)
            currentPlayer = 0;

          return notAWinner;
        }else{
          currentPlayer += 1;
          if(currentPlayer == players.length)
            currentPlayer = 0;
          return true;
        }

      }else{

        console.log("Answer was correct!!!!");

        purses[currentPlayer] += 1;
        var str = (purses[currentPlayer] > 1) ? (players[currentPlayer] + " now has " + purses[currentPlayer]  + " Gold Coins.") : (players[currentPlayer] + " now has " + purses[currentPlayer]  + " Gold Coin.");
        console.log(str);

        var notAWinner = didPlayerNotWin();

        currentPlayer += 1;
        if(currentPlayer == players.length)
          currentPlayer = 0;

        return notAWinner;
      }
    };

    this.wrongAnswer = function(){
  		console.log('Question was incorrectly answered');
  		console.log(players[currentPlayer] + " was sent to the penalty box");
  		inPenaltyBox[currentPlayer] = true;

      currentPlayer += 1;
      if(currentPlayer == players.length)
        currentPlayer = 0;
  		return true;
    };
  };

  var notAWinner = true;
  var game = new Game();

  game.add('Chet');
  game.add('Pat');
  game.add('Sue');

  do{

    game.roll(Math.floor(Math.random()*6) + 1);

    if(Math.floor(Math.random()*10) == 7){
      notAWinner = game.wrongAnswer();
    }else{
      notAWinner = game.wasCorrectlyAnswered();
      console.log(notAWinner);
    }

  }while(notAWinner);


