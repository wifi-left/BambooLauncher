const fs = require('fs');

function configControl(filename) {
    this.filename = filename ? filename : "config.json";
    this.config = {};
    this.load = function () {
        try {
            this.config = JSON.parse(fs.readFileSync("./config/" + filename));
        } catch (e) {
            // config = {}
            try {
                if (!fs.existsSync("./config")) fs.mkdirSync("./config")
                fs.writeFileSync("./config/" + filename, JSON.stringify(this.config));
            } catch (e) {
                console.error(e);
                return false;
            }
        }
        return true;
    }
    this.get = function (key, fallbackstr) {
        if (this.config[key] != undefined) {
            return this.config[key];
        } else {
            return fallbackstr;
        }
    }
    this.set = function (key, value) {
        this.config[key] = value;
        return this.save();
    }
    this.save = function () {
        try {
            fs.writeFileSync("./config/" + filename, JSON.stringify(this.config));
        } catch (e) {
            // config = {}
            return false;
        }
        return true;
    }
    this.load();
}

module.exports = {
    configControl
}