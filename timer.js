const digiExtract = new RegExp(/^\D+/);


function TimerParseTime(message){
    let length = 0;
    // 60 = 60 seconds 2:30 = 2 min 30 seconds, 2:30:59 = 2 hours 30 mins 59 seconds
    // 4:20:59:59 = 4 days 20 hours 59 mins 59 seconds.
    // single length = seconds, 2 length = mins + seconds, 
    // 3 length = hours + mins + seconds, 4 length = days + hours + mins + seconds
    console.log("Message: " + message);
    let digitExtract = message.replace(digiExtract,'');
    console.log("Extract: " + digitExtract);
    let parsedMessage = digitExtract.split(":");
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

module.exports = {
    TimerParseTime
}