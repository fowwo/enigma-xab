/**
 * A Node.js program to fetch chat messages from Twitch VODs.
 * 
 * 1. npx twitch-chatlog -c -s 00:00:00 -e 00:00:00 -r <vod-id> > logs.json
 * 2. Save logs.json as UTF-8
 * 3. node ./vod.js
 * 
 * @author fowwo
 */

import fs from "fs";
const raw = fs.readFileSync("logs.json", "utf8");
const json = JSON.parse(raw);

let list = [];
for (var chat of json) list.push(`\t${chat.commenter.display_name}:${chat.message.body}\n`);
fs.writeFileSync("logs.txt", list.join(""), "utf8");
