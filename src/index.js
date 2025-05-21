import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

dotenv.config();

const model = new ChatOpenAI({ model: "gpt-4" });

const inputs = {
	album: [
		`Manic Street Preachers' album "The Holy Bible"`,
		`Smashing Pumpkins' album "Melon Collie & the Infinite Sadness"`,
		`The Beatles' album "Sergeant Pepper's Lonely Hearts Club Band"`
	],
	name: [
		"Alex",
		"Max",
		"Jack",
		"Jason",
		"Jaz"
	],
	system: [
		`As faithfully as possible, rephrase this input using language that is stylistically similar to the song titles from`
	],
	user: [
		`is watching whether this app works.`,
		`is very hungry`,
		`is a resident of London`
	]
};

function randomEntry (arr) {
	const index = Math.floor(Math.random() * arr.length);
	
	return arr[index];
}

const message = {
	user: `${randomEntry(inputs.name)} ${randomEntry(inputs.user)}`,
	system: `${randomEntry(inputs.system)} ${randomEntry(inputs.album)}`
}

async function getOutput() {
	const messages = [
		new HumanMessage(message.user),
		new SystemMessage(message.system)
	]

	console.group(`===User Input===`);
	console.log(message.user);
	console.log(" ");
	console.groupEnd();

	console.group(`===System Input===`);
	console.log(message.system);
	console.log(" ");
	console.groupEnd();

	console.group(`===Output===`);
	const output = await model.invoke(messages);
	console.log(output.content);
	console.groupEnd();
};
getOutput();

// async function streamOutput() {
// 	const messages = [
// 		new HumanMessage(message.user),
// 		new SystemMessage(message.system)
// 	]

// 	console.group(`===User Input===`);
// 	console.log(message.user);
// 	console.log(" ");
// 	console.groupEnd();

// 	console.group(`===System Input===`);
// 	console.log(message.system);
// 	console.log(" ");
// 	console.groupEnd();

// 	const stream = await model.stream(messages);
// 	const chunks = [];

// 	console.group(`===Output===`);
// 	for await (const chunk of stream) {
// 		chunks.push(chunk);
// 		console.log(`${chunk.content}|`);
// 	}
// 	console.groupEnd();
// };
// streamOutput();