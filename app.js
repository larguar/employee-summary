const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require('util');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// wfa = short for write file async
const wfa = util.promisify(fs.writeFile);

const render = require("./lib/htmlRenderer");

start();

async function start() {
	// empty array to push new employees to
	const employees = [];
	
	// add a manager based on prompts
	const manager = await addManager();
	const newManager = new Manager(manager.name, manager.id, manager.email, manager.officeNumber);
	employees.push(newManager);
	
	// select the next employee type
	let selection = await selectType();
	
	// continue looping until the user selects no more members
	while (selection.type !== 'I don\'t want to add any more team members') {
		if (selection.type === 'Engineer') {
			const engineer = await addEngineer();
			const newEngineer = new Engineer(engineer.name, engineer.id, engineer.email, engineer.github);
			employees.push(newEngineer);
		} else {
			const intern = await addIntern();
			const newIntern = new Intern(intern.name, intern.id, intern.email, intern.school);
			employees.push(newIntern);
		}
		selection = await selectType();
	}
	
	// function to render the new HTML
	const renderHTML = render(employees);
	
	console.log(employees);
	console.log(renderHTML);
	
	// write a new file with the rendered HTML
	async function init() {
		try {
			const file = renderHTML;		
			await wfa(outputPath, file);
			console.log('Success: New file has been generated.');
		} catch (err) {
			console.log(err);
		}
	}
	init();

}

// prompts to add a manager
function addManager() {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is your manager\'s name?'
		},
		{
			type: 'input',
			name: 'id',
			message: 'What is your manager\'s id?'
		},
		{
			type: 'input',
			name: 'email',
			message: 'What is your manager\'s email?'
		},
		{
			type: 'input',
			name: 'officeNumber',
			message: 'What is your manager\'s office number?'
		}
	]);
}

// prompt to select a new employee type to add next or exit
function selectType() {
	return inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'What type of team member would you like to add?',
			choices: [
				'Engineer',
				'Intern',
				'I don\'t want to add any more team members'
			]
		}
	]);
}

// prompts to add an engineer
function addEngineer() {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is your engineer\'s name?'
		},
		{
			type: 'input',
			name: 'id',
			message: 'What is your engineer\'s id?'
		},
		{
			type: 'input',
			name: 'email',
			message: 'What is your engineer\'s email?'
		},
		{
			type: 'input',
			name: 'github',
			message: 'What is your engineer\'s GitHub username?'
		}
	]);
}

// prompts to add an intern
function addIntern() {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is your intern\'s name?'
		},
		{
			type: 'input',
			name: 'id',
			message: 'What is your intern\'s id?'
		},
		{
			type: 'input',
			name: 'email',
			message: 'What is your intern\'s email?'
		},
		{
			type: 'input',
			name: 'school',
			message: 'What is your intern\'s school?'
		}
	]);
}