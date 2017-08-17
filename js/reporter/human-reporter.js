module.exports = report => {
    const messages = report.messages;
    if (messages.length > 0) {
        console.log("Messages:");
        messages.forEach(x => console.log(x.message));
    }
};
