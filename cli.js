#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createProject() {
  const { projectName, database } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'backend'
    },
    {
      type: 'list',
      name: 'database',
      message: 'Choose database:',
      choices: ['PostgreSQL', 'MongoDB']
    }
  ]);

  const templatePath = path.join(__dirname, 'templates', 'base');
  const dbTemplatePath = path.join(__dirname, 'templates', database.toLowerCase());
  
  await fs.copy(templatePath, projectName);
  await fs.copy(dbTemplatePath, projectName, { overwrite: true });
  
  // Remove drizzle files if MongoDB selected
  if (database === 'MongoDB') {
    const projectPath = path.join(process.cwd(), projectName);
    await fs.remove(path.join(projectPath, 'migrate.js'));
    await fs.remove(path.join(projectPath, 'drizzle.config.js'));
  }
  
  console.log(`\nProject ${projectName} created successfully!`);
  console.log('Next steps:');
  console.log(`1. cd ${projectName}`);
  console.log('2. npm install');
  console.log('3. Create .env file from .env.example');
  console.log('4. npm run migrate');
}

createProject().catch(console.error); 