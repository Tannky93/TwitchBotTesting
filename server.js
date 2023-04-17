require('dotenv').config();

const tmi = require('tmi.js');
const fs = require('fs');

const regexpCommand = new RegExp(/^!([a-zA-z0-9]+)(?:\w+)?(.*)?/);
const digExtract = new RegExp(/^\D+/);

const commands = {
    website: {
        response: 'https://www.twitch.tv/tannky93'
    },
    hello: {
        response: (user) => `Hello ${user},  Great to see you!`
    },
    addcommand:{ 
        response: 'addcommand'  
    },
    botupdate:{
        response: 'botupdate'
    },
    timer:{
        response: 'timer'
    }
}

let customCommandTrigger=[];
let customCommandContent = [];
var customCount = 0;

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: [ 'tannky93' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
    const isNotBOT = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;
	
    if(self) return;
    
    const [raw,command,argument] = message.match(regexpCommand)?? "";
    
    console.log(tags);
    console.log("Raw: " + raw);
    console.log("Command: "+ command)
    console.log("Arg: "+ argument);

    const { response } = commands[command] || {};

    
    switch(typeof response){
        case 'function':
            client.say(channel,response(tags.username));
            break;
        case 'string':
            switch(response){
                case 'addcommand':
                    CreateCommand(channel,argument);
                    break;
                case 'botupdate':
                    ReadFromFile();
                    break;
                case 'timer':
                    Timer(channel,message);
                    break;
                default:
                    client.say(channel,response);
                    break;
            }
            
    }
    
    if(message.charAt(0)==="!"){
        for (let index = 0; index < customCommandTrigger.length; index++) {
            const element = customCommandTrigger[index];
            if(raw === customCommandTrigger[index]){
                client.say(channel,customCommandContent[index]);
            }
        }
    }

    
});

function CreateCommand(channel,message){
    client.say(channel,'Command create called!');
    const messageSplitCommand = message.split(" ",2);
    const messageSplitContent = message.split(messageSplitCommand[1]);
    console.log("New command: "+ messageSplitCommand[1]);
    console.log("Command content: " + messageSplitContent[1])
    customCommandTrigger[customCount] = "!"+messageSplitCommand[1];
    customCommandContent[customCount] = messageSplitContent[1];
    WriteToFile(customCount);
    customCount++;
}

function WriteToFile(index){
    
    fs.appendFile("commandTrigger.txt",customCommandTrigger[index] + ",",(err)=>{
        if(err) throw err;
        console.log("data appended" + customCommandTrigger[index]);
    })

    fs.appendFile("commandContent.txt",customCommandContent[index] + "*,*",(err)=>{
        if(err) throw err;
        console.log("data appended" + customCommandContent[index]);
    })
    
}

function ReadFromFile(){
    
        var triggersRaw ="";
        var contentRaw = "";
        
        fs.readFile("commandTrigger.txt",'utf8',(err,data)=>{
            if(err) throw err;
            console.log(data);
            triggersRaw = data;

            const triggersSplit = triggersRaw.split(",");

            console.log("Raw Trigers: " + triggersRaw);

            for (let index = 0; index < triggersSplit.length-1; index++) {
                const element = triggersSplit[index];
                console.log("trigger split: "+triggersSplit[index]);
                customCommandTrigger[index] = triggersSplit[index];
                customCount++;
            }

        })
       fs.readFile("commandContent.txt",'utf8',(err,data)=>{
            if(err) throw err;
            console.log(data);
            contentRaw = data;

            console.log("Raw Content: " + contentRaw);

            const contentSplit = contentRaw.split("*,*");
        
            for (let index = 0; index < contentSplit.length-1; index++) {
                const element = contentSplit[index];
                console.log("content split: "+contentSplit[index]);
                customCommandContent[index] = contentSplit[index];
            }
    
        })   

}

async function Timer(channel, message) {
    var length = TimerParseTime(message);
    client.say(channel,`The length of the timer is ${length} seconds`);

}

function TimerParseTime(message){
    var length = 0;
    // 60 = 60 seconds 2:30 = 2 min 30 seconds, 2:30:59 = 2 hours 30 mins 59 seconds
    // 4:20:59:59 = 4 days 20 hours 59 mins 59 seconds.
    // single length = seconds, 2 length = mins + seconds, 
    // 3 length = hours + mins + seconds, 4 length = days + hours + mins + seconds
    console.log("Message: " + message);
    var digitExtract = message.replace(digExtract,'');
    console.log("Extract: " + digitExtract);
    var parsedMessage = digitExtract.split(":");
    console.log("first value: " + parsedMessage[0]);
    console.log("Length: " + parsedMessage.length);

    switch(parsedMessage.length){
        case 1:
            console.log("case 1");
            length = parseInt(parsedMessage[0]);
            console.log(length + " Seconds")
            break;
        case 2:
            console.log("case 2");
            console.log (parsedMessage[0]+" minutes and " + parsedMessage[1] + " seconds");
            length = (parseInt(parsedMessage[0]) * 60) + parseInt(parsedMessage[1]);
            console.log(length + " seconds");
            break;
        case 3:
            console.log("case 3");
            console.log (parsedMessage[0]+" hours and "+parsedMessage[1]+" minutes and " + parsedMessage[2] + " seconds");
            length = ((parseInt(parsedMessage[0]) * 60) * 60) + (parseInt(parsedMessage[1]) * 60) + parseInt(parsedMessage[2]);
            console.log(length + " seconds");
            break;
        case 4:
            console.log("case 4");
            console.log (parsedMessage[0]+" days and "+ parsedMessage[1]+" hours and " + parsedMessage[2] + " minutes and " + parsedMessage[3] + " seconds");
            length = (((parseInt(parsedMessage[0]) * 24) * 60) * 60) + ((parseInt(parsedMessage[1]) * 60) * 60) + (parseInt(parsedMessage[2]) * 60) + parseInt(parsedMessage[3]);
            console.log(length + " seconds");
            
            break;
        default:
            length = 1;
            console.log("case Default")
            break;
    }

    return length;
}
