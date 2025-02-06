#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';
import { copyTemplate } from './utils/scaffold.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '📁 Project name:',
        default: 'backend'
      },
      {
        type: 'list',
        name: 'database',
        message: '💾 Choose database:',
        choices: ['PostgreSQL', 'MongoDB']
      }
    ]);

    const templatePath = path.join(
      __dirname,
      'templates',
      answers.database.toLowerCase()
    );
    
    await copyTemplate(templatePath, answers.projectName);
    
    // Database-specific operations
    if (answers.database === 'PostgreSQL') {
      await addPostgresFiles(answers.projectName);
    } else {
      await removeDrizzleFiles(answers.projectName);
    }

    // Success message
    console.log(
      chalk.hex('#00FF00').bold(`
      🚀 ${chalk.underline('Project created successfully!')} 
      📂 ${chalk.blue('Directory:')} ${chalk.yellow(answers.projectName)}
      `)
    );

    console.log(chalk.hex('#34ebd8').bold(`
      📋 ${chalk.bold('Next steps:')}
      ${chalk.cyan('1.')} cd ${answers.projectName}
      ${chalk.cyan('2.')} npm install
      ${chalk.cyan('3.')} Create .env file from .env.example
      ${chalk.cyan('4.')} ${answers.database === 'PostgreSQL' ? 'npm run db:migrate' : 'npm run dev'}
    `));

  } catch (err) {
    console.log(chalk.red.bold(`
    ❌ ${chalk.bold('Error:')} ${err.message}
    `));
    process.exit(1);
  }
}

async function addPostgresFiles(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    await fs.copy(path.join(__dirname, 'templates', 'postgres'), projectPath);

}


async function removeDrizzleFiles(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  await fs.remove(path.join(projectPath, 'migrate.js'));
  await fs.remove(path.join(projectPath, 'drizzle.config.js'));
}

init(); 