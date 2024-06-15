const fs = require('fs');
var ips = JSON.parse(fs.readFileSync(__dirname + '/ip-bans.json'));
exports.init = () => {
    if (!fs.existsSync(__dirname + '/ip-bans.json')) {
        fs.writeFileSync(__dirname + '/ip-bans.json', '[]');
    }
}
exports.ips = ips;
exports.ban = (ip) => {
    ips.push(ip);
    fs.writeFileSync(__dirname + '/ip-bans.json', JSON.stringify(ips));
}
exports.checkIP = (ip) => {
    var result = false;
    for (var i in ips) {
        if (ip = ips[i]) {
            result = true;
        }
    }
    return result;
}
exports.getIP = (req) => {
    return req.headers["CF-Connecting-IP"] || req.ip;
}