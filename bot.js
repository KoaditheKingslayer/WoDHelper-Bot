const Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var roll1 = 0;
var roll2 = 0;
var symbol1 = 'default';
var symbol2 = 'default';
var msg1 = ' '
var sendMessage = ' ';
var resultMessage = ' ';
let counter = 0;
var insertText = "";

function rollDice (dicePool, difficulty, spec) {
  /* Variable Declaration */
  specCheck = spec;
  counter++;
  const dieArray = [];
  let tensRolled = 0;
  let explodingTens = 0;
  let subtractingOnes = 0;
  let onesRolled = 0;
  let successesRolled = 0;
  let failuresRolled = 0;
  let totalRolled = 0;
  let successes = 0;
  let botch = false;
  var specMsg;
  /* End Variable Declaration */

  /* Verify Inputs */
  if (difficulty > 10 || difficulty < 2) {
    insertText = 'Difficulty Out of Range (2 to 10).';
    return
  }
  if (dicePool > 1000 || dicePool < 1) {
    insertText = 'Dice Pool out of Range (1 to 1000)';
    return
  }
  /* End Verify Inputs */

  /* Roll Dice */
  for (let i = 0; i < dicePool; i++) {
    dieArray.push(parseInt(Math.floor(Math.random() * 10) + 1))

    if (dieArray[i] >= difficulty) {
      successesRolled++;
      totalRolled++;
    }

    if (dieArray[i] === 10) {
      tensRolled++;
    }

    if (dieArray[i] < difficulty) {
      failuresRolled++;
      totalRolled++;
    }

    if (dieArray[i] === 1) {
      onesRolled++;
      subtractingOnes++;
    }
  }

  /* End Roll Dice */

  // Sort array from Lowest to Highest
  dieArray.sort((a, b) => a - b)

  if (specCheck == 's') {
    specMsg = 'was'
  } else { specMsg = 'was not' }

  /* Parse Results with w20 Rules */
  if (specCheck == 's'){
    successes = successesRolled + tensRolled - onesRolled;
  }else{
    successes = successesRolled - onesRolled;
  }

  if (successesRolled <= 0 && onesRolled >= 1){
    botch = true;
    insertText = `ROLL ${counter}: ${dieArray.length} dice rolled ${dieArray} at Difficulty ${difficulty}. Parsed result is: ${successes} Successes. ${tensRolled} of the dice were 10's, and ${onesRolled} were 1's. This ${specMsg} a Specialty roll, and has resulted in a BOTCH!`;
  }else if(successes < 1){
    botch = false;
    insertText = `ROLL ${counter}: ${dieArray.length} dice rolled ${dieArray} at Difficulty ${difficulty}. Parsed result is: ${successes} Successes. ${tensRolled} of the dice were 10's, and ${onesRolled} were 1's. This ${specMsg} a Specialty roll, and has resulted in a FAILURE.`;
  }else{
    botch = false;
    insertText = `ROLL ${counter}: ${dieArray.length} dice rolled ${dieArray} at Difficulty ${difficulty}. Parsed result is: ${successes} Successes. ${tensRolled} of the dice were 10's, and ${onesRolled} were 1's. This ${specMsg} a Specialty roll, and has resulted in a SUCCESS.`;
  }


  /* End Parse and Output */
}


function chops(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function randomTest(sign = -1) {

    // reset the dice to 0
    roll1 = 0;
    roll2 = 0;
    // roll two 3-sided dice (roll1 and roll2), if passed a sign, use that sign.
    if (sign !== -1) { roll1 = sign; }
    else { roll1 = chops(3);}
    roll2 = chops(3);
    // assign face values for roll1: 0=Rock, 1=Paper, 2=Scissors
    switch (roll1) {
        case 0:
            symbol1 = 'Rock';
            break;
        case 1:
            symbol1 = 'Paper';
            break;
        case 2:
            symbol1 = 'Scissors';
            break;
    }
        // assign face values for roll2: 0=Rock, 1=Paper, 2=Scissors
    switch (roll2) {
        case 0:
            symbol2 = 'Rock';
            break;
        case 1:
            symbol2 = 'Paper';
            break;
        case 2:
             symbol2 = 'Scissors';
             break;
    }

    if (roll1 == 0 && roll2 == 0) { resultMessage = " It's a Tie!"; }
    if (roll1 == 0 && roll2 == 1) { resultMessage = " You Lose!"; }
    if (roll1 == 0 && roll2 == 2) { resultMessage = " You Win!"; }
    if (roll1 == 1 && roll2 == 0) { resultMessage = " You Win!"; }
    if (roll1 == 1 && roll2 == 1) { resultMessage = " It's a Tie!"; }
    if (roll1 == 1 && roll2 == 2) { resultMessage = " You Lose!"; }
    if (roll1 == 2 && roll2 == 0) { resultMessage = " You Lose!"; }
    if (roll1 == 2 && roll2 == 1) { resultMessage = " You Win!"; }
    if (roll1 == 2 && roll2 == 2) { resultMessage = " It's a Tie!"; }
    msg1 = ' You have thrown ' + symbol1 + '. Your Opponent has thrown ' + symbol2 + '.';
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');


});

    bot.on('message', function (user, userID, channelID, message, evt) {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];
            var cmd2 = args[1];
            var cmd3 = args[2];
            var cmd4 = args[3];

            args = args.splice(1);

            switch (cmd) {
                // !commands
                case 'commands':
                    bot.sendMessage({
                        to: channelID,
                        message: ' You can choose any of the following: Choose a Throw: !rock, !paper, !scissors. Or Random both sides: !rps - OR !rolldice #[pool] #[diff] s[if specialty] '
                    });
                    break;

                // !rps
                case 'rps':
                    randomTest();
                    sendMessage = user + ': ' + msg1 + resultMessage;
                    bot.sendMessage({
                        to: channelID,
                        message: sendMessage
                    });
                    break;

                case 'rock':
                    randomTest(0);
                    sendMessage = user + ': ' + msg1 + resultMessage;
                    bot.sendMessage({
                        to: channelID,
                        message: sendMessage
                    });
                    break;
                    break;
                case 'paper':
                    randomTest(1);
                    sendMessage = user + ': ' + msg1 + resultMessage;
                    bot.sendMessage({
                        to: channelID,
                        message: sendMessage
                    });
                    break;
                case 'scissors':
                    randomTest(2);
                    sendMessage = user + ': ' + msg1 + resultMessage;
                    bot.sendMessage({
                        to: channelID,
                        message: sendMessage
                    });
                    break;
                case 'roll': // Difficulty 6 D10 Roll - Not Yet Implemented or Coded
                    rollDice(cmd2, cmd3, cmd4);
                    sendMessage = user + ': ' + msg1 + insertText;
                    bot.sendMessage({
                        to: channelID,
                        message: sendMessage

                    });
                    sendMessage = ' ';
                    break;
            }
        }
    })
