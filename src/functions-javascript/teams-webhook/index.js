const botName = process.env.BOT_NAME || 'StatusPage';

module.exports = async function (context, req, latestStatuses) {
    const { id, from, text: rawMessage } = req.body;
    const { command, text } = parseMessage(rawMessage);
    
    if (command === 'help') {
        return setBotResponse(context, helpText());
    }
    
    const latestStatus = latestStatuses[0];
    if (latestStatus) {
        if (command === 'open' ) {
            return setBotResponse(context, "There's already an incident open.");
        } else if ((command === 'close' || command === 'update')) {
            return setBotResponse(context, "There is no open incident right now.");
        }
    }

    // return message to Teams
    context.res.json({
        "type": "message",
        "text": "Status received"
    });
};

function pad(num, size) {
    var s = "00000000000000000000" + num;
    return s.substr(s.length-size);
}

function parseMessage(rawMessage) {
    rawMessage = rawMessage.replace('&nbsp;', ' ');
    rawMessage = rawMessage.replace(`<at>${botName}</at>`, '').trim();
    let [ _, command, text ] = /^(\S+)(.*)$/.exec(rawMessage);
    command = (command || '').toLowerCase();
    if (['open', 'close', 'update'].indexOf(command) < 0) {
        command = 'help';
    }
    return {
        command,
        text: text.trim()
    };
}

function helpText() {
    return `Usage:\n
        @${botName} open [message]
        @${botName} update [message]
        @${botName} close [message]
        @${botName} help`
}

function setBotResponse(context, msg) {
    context.res.json({
        type: 'message',
        text: msg
    });
}
