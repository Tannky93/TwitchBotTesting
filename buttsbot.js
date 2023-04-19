const apaPro = require('pronouncing');
const buttify = require('./server.js');



function stringSplitter(messagePassed){
    
    let butt = "butt";
    let frequency = 2; // 2,4,6,8,10 5/10 chance for being subsituted.
    //console.log("Passed to splitter: " + messagePassed)
    let splitMessage = messagePassed.split(' ');
    //console.log("Split message first element: " + splitMessage[0]);
    //console.log("Length before bot processing: "+splitMessage.length);

    for (let index = 0; index < splitMessage.length; index++) {

        let syllable = fastSyllablesCheck(splitMessage[index]);

        console.log("word: " + splitMessage[index] + " Syl: " + syllable);

        if( syllable === 1){
            let chance = Math.floor(Math.random() * 10);
            if(chance % frequency === 0){
                console.log("should have been triggered");
                splitMessage[index] = butt;
                buttify.SetButtified(true);
            }
        }
    }

    //console.log("Length after processing: "+splitMessage.length);

    return response = stringBuilder(splitMessage);


}

function stringBuilder(messageReceived){
    let rebuilt ="";

    for (let index = 0; index < messageReceived.length; index++) {
        //console.log("Length: "+messageReceived.length);
        rebuilt = rebuilt + messageReceived[index] + " ";
    }

    return rebuilt;
}

function fastSyllablesCheck(word){
    return count = apaPro.syllableCount(apaPro.phonesForWord(word)[0]);
}

module.exports={
    stringSplitter
}