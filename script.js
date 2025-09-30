const inquirer = require('inquirer');
const { Parser } = require('json2csv');
const fs = require('fs');

// Define the questions for inquirer
const questions = [
  {
    type: 'list',
    name: 'location',
    message: 'Location?',
    choices: ['NetSuite', 'Shopify', 'Wordpress', 'NetSuite + Shopify', 'All',  'Other']
  },
  {
    type: 'input',
    name: 'task',
    message: 'What are you working on?',
    validate: (value) => value.trim() ? true : 'Please enter a task description'
  },
  {
    type: 'list',
    name: 'status',
    message: 'Status?',
    choices: ['In progress', 'Not Started', 'Errors']
  },
  {
    type: 'input',
    name: 'toComplete',
    message: 'What needs to be done to complete?',
    validate: (value) => value.trim() ? true : 'Please enter what needs to be done'
  },
  {
    type: 'list',
    name: 'priority',
    message: 'Priority?',
    choices: ['High', 'Medium', 'Low']
  },
  {
    type: 'confirm',
    name: 'addAnother',
    message: 'Add another task?',
    default: false
  }
];

// Array to store tasks
const tasks = [];

// Function to prompt for tasks
async function getTask() {
  const answers = await inquirer.prompt(questions);

  // Store the task
  tasks.push({
    'Location': answers.Location,
    'What I\'m working on': answers.task,
    'Status': answers.status,
    'What needs to be done to complete': answers.toComplete,
    'Priority': answers.priority
  });

  // Check if user wants to add another task
  if (answers.addAnother) {
    await getTask();
  } else {
    // Convert to CSV and save
    const fields = ['location', 'What I\'m working on', 'Status', 'What needs to be done to complete', 'Priority'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(tasks);

    fs.writeFile('tasks.csv', csv, (err) => {
      if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log('Tasks saved to tasks.csv');
      }
    });
  }
}

// Start collecting tasks
console.log('Enter task details:');
getTask().catch((err) => console.error('Error:', err));