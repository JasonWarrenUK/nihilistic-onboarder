import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { input, select } from '@inquirer/prompts';
import dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({ model: "gpt-4" });

function randomEntry (arr) {
	const index = Math.floor(Math.random() * arr.length);
	
	return arr[index];
}

const inputs = {
	dev: [
		"Alex",
		"Jason",
		"Jaz"
	],
	style: [
		"passive-aggressive",
		"nihilistic",
		"dada-ist",
		"absurdist",
		"provocative",
		"death cult adherent",
		"devout follower of Scientology"
	],
	ticket: [
		`make sure the app meets accessibility requirements that don't actually apply to this project`,
		`deliver exactly what the client wants without knowing what the client wants`,
		`successfully complete user testing before being allowed to begin user testing`,
		`remove any functionality that might actually be useful, innovative or groundbreaking`
	]
};

const prompt = {
	ticket: {
		user: [
			`Ticket: ${randomEntry(inputs.ticket)}`,
			`Style: ${randomEntry(inputs.style)}`
		].join("; "),
		system: `
			Generate a github Issue that captures the problem described in "ticket". The output should be tonally similar to a standard GitHub issue, but the actual task being described should be created to fit the "style". It should be presented in Markdown format, and should not appear to be a personal communication. You must not explicitly reference the style.
		`
	},
	roast: {
		system: "You are being given the name of a developer. Generate a brief hyperbolic sentence expressing an obviously untrue concern about this developer's lack of technical abilities. The tone must be extremely professionalm, as if this were a confidential HR department memo. Do not use pronouns."
	}
}

async function printHeader() {
	console.clear();
	console.log(`|=====================|`);
	console.log(`|==|               |==|`);
	console.log(`|==| B E A C O N S |==|`);
	console.log(`|==|               |==|`);
	console.log(`|=====================|`);
	return;
}

async function getOutput() {
	await printHeader();

	console.group(`===WELCOME TO LIFT PROJECT MANAGER===`);
	console.log(`Greetings developer`);

	let who = await select({
		message: "Please identify yourself",
		choices: [
			{ value: "Alex" },
			{ value: "Jason" },
			{ value: "Jaz" },
			{ value: "Other" }
		],
	});

	if (who == "Other") {
		who = await input({
			message: "Please enter your name"
		})
	}

	const scale = await select({
		message: "Choose Skillset Assessment scale",
		choices: [
			{ value: "team", name: "Assess Whole Team" },
			{ value: "dev", name: `Assess ${who}` }
		],
	});

	scale == "team" ? await getRoast(inputs.dev) : await getRoast([who]);

	console.log("Assessment Concluded");
	console.log("Adjusting expectations");

	const issueType = await select({
		message: "Do you have a specific task that needs tackling, or are you free to be assigned to an existing issue?",
		choices: [
			{ value: "random", name: "Assign Me an Issue" },
			{ value: "input", name: "I Have a Task in Mind" }
		]
	});

	let ticket;

	if (issueType == "random") {
		console.log("Please wait while I assign you a task");

		ticket = await model.invoke([
			new HumanMessage(prompt.ticket.user),
			new SystemMessage(prompt.ticket.system)
		]);
	} else {
		const task = await input({
			message: "Please concisely explain your task"
		})

		ticket = await model.invoke([
			new HumanMessage(`Ticket: ${task}; Style: ${randomEntry(inputs.style)}`),
			new SystemMessage(prompt.ticket.system)
		])
	}

	console.clear();

	console.log(ticket.content);
	console.groupEnd();
};

async function getRoast(team) {
	console.clear();

	for await (const dev of team){
		console.group(`getWeaknesses(${dev})`);

		const messages = [
			new HumanMessage(dev),
			new SystemMessage(prompt.roast.system)
		]

		const stream = await model.stream(messages);
		const chunks = [];

		for await (const chunk of stream) {
			chunks.push(chunk);
			console.log(`${chunk.content}|`);
		}

		console.clear();
		console.groupEnd();
	}

	console.clear();
	return;
}

getOutput();