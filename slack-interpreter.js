module.exports = slackInterpreter = (cmd) => {
    let query = cmd.split(',');
    let request = {};
    let i = query.length;
    while (i--) {
        let val = query[i].trim();
        if (i === 0) {
            request.author = val;
        } else if (i === 1) {
            request.title = val;
        } else if (i === 2) {
            request.publisher = val;
        } else if (i === 3) {
            request[isNaN(val) ? 'format' : 'year'] = val;
        } else if (i === 4) {
            request.format = val;
        }
    }
    return request;
};
