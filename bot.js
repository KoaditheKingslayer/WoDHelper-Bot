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

            args = args.splice(1);

            switch (cmd) {
                // !commands
                case 'commands':
                    bot.sendMessage({
                        to: channelID,
                        message: ' You can choose any of the following: Choose a Throw: !rock, !paper, !scissors. Or Random both sides: !rps'
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
                case 'diff6': // Difficulty 6 D10 Roll - Not Yet Implemented or Coded
                    sendMessage = ;
                    bot.sendMessage({
                        to: channelID,
                        message: sendMessage
                    });
                    break;
            }
        }
    })