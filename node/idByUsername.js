/**
 * A Node.js program to fetch user information given a username.
 * This code has no real purpose other than figuring out how to
 * fetch information from Twitch's API.
 * 
 * @author fowwo
 */

const fs = require("fs");
const fetch = require("node-fetch");
const usernames = process.argv.slice(2);
const twitchInfo = JSON.parse(fs.readFileSync("info.json"));
const url = "https://api.twitch.tv/helix/users?";
const options = {
	method: 'GET',
	headers: {
		"client-id": twitchInfo.clientID,
		Authorization: twitchInfo.authorization
	}
};

fetch(url + `login=${usernames.join("&login=")}`, options)
  .then(res => res.json())
  .then(data => console.log(data));
