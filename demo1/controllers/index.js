exports.handleRes = (req, res) => {
    res.writeHead(200, { });
    res.write('data');
    res.end();
}