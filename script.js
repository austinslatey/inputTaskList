const prompt = require('prompt');
const { Parser } = require('json2csv');
const fs = require('fs');

// Define the schema for prompts
const schema = {
  properties: {
    task: {
      description: 'What are you working on?',
      type: 'string',
      required: true
    },
    status: {
      description: 'Status? (In progress, Not Started, Errors)',
      type: 'string',
      enum: ['In progress', 'Not Started', 'Errors'],
      required: true
    },
    toComplete: {
      description: 'What needs to be done to complete?',
      type: 'string',
      required: true
    },
    priority: {
      description: 'Priority? (High, Medium, Low)',
      type: 'string',
      enum: ['High', 'Medium', 'Low'],
      required: true
    },
    addAnother: {
      description: 'Add another task? (yes/no)',
      type: 'string',
      pattern: /^(yes|no)$/i,
      message: 'Please enter "yes" or "no"',
      required: true
    }
  }
};

// Array to store tasks
const tasks = [];

// Start the prompt
prompt.start();

function getTask() {
  prompt.get(schema, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    // Store the task
    tasks.push({
      'What I\'m working on': result.task,
      'Status': result.status,
      'What needs to be done to complete': result.toComplete,
      'Priority': result.priority
    });

    // Check if user wants to add another task
    if (result.addAnother.toLowerCase() === 'yes') {
      getTask();
    } else {
      // Convert to CSV and save
      const fields = ['What I\'m working on', 'Status', 'What needs to be done to complete', 'Priority'];
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
  });
}

// Start collecting tasks
console.log('Enter task details:');
getTask();