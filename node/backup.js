/**
 * A Node.js program to create backups of the score file.
 * This code was used prior to the creation of the web page:
 * https://fowwo.github.io/enigma-xab/
 * 
 * @author fowwo
 */

const fs = require("fs");
const date = new Date();
const data = JSON.parse(fs.readFileSync("../data.json"));
const path = `../backup/${date.toISOString().slice(0, 10)} ${date.toTimeString().slice(0, 8).replace(/:/g, ".")}.json`;

fs.writeFileSync(path, JSON.stringify(data, null, 4) + "\n");

console.log(`Successfully backed up data to: ${path}`);
