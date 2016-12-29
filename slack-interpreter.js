module.exports = slackInterpreter = (cmd) => {
    let query = cmd.split(' ');
    let request = {};
    let i = query.length;
    while (i--) {
        if (i === 0) {
            request.author = query[i];
        } else if (i === 1) {
            request.title = query[i];
        } else if (i === 2) {
            request.publisher = query[i];
        } else if (i === 3) {
            request.year = query[i];
        } else if (i === 4) {
            request.format = query[i];
        }
    }
    console.log("\\\\", cmd, "===>", request, "//");
    return request;
};
