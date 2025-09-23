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
      description: 'Status? (Select a number)',
      type: 'string',
      enum: ['In progress', 'Not Started', 'Errors'],
      required: true,
      message: 'Please select a valid status option (1-3)',
      conform: function(value) {
        const options = ['In progress', 'Not Started', 'Errors'];
        return options.includes(value);
      },
      before: function(value) {
        const options = ['In progress', 'Not Started', 'Errors'];
        return options[parseInt(value) - 1] || value;
      },
      ask: function() {
        console.log('1. In progress\n2. Not Started\n3. Errors');
        return true;
      }
    },
    toComplete: {
      description: 'What needs to be done to complete?',
      type: 'string',
      required: true
    },
    priority: {
      description: 'Priority? (Select a number)',
      type: 'string',
      enum: ['High', 'Medium', 'Low'],
      required: true,
      message: 'Please select a valid priority option (1-3)',
      conform: function(value) {
        const options = ['High', 'Medium', 'Low'];
        return options.includes(value);
      },
      before: function(value) {
        const options = ['High', 'Medium', 'Low'];
        return options[parseInt(value) - 1] || value;
      },
      ask: function() {
        console.log('1. High\n2. Medium\n3. Low');
        return true;
      }
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