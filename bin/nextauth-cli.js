#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { setup } = require('../lib/setup');
const { showWelcome } = require('../lib/utils');

async function main() {
  showWelcome();

  const questions = [
    {
      type: 'checkbox',
      name: 'providers',
      message: 'Select authentication providers (choose at least one):',
      choices: ['Google OAuth', 'GitHub OAuth', 'Apple OAuth', 'Facebook OAuth', 'Email Magic Links', 'Credentials'],
      validate: (answer) => {
        if (answer.length < 1) {
          return 'Please select at least one provider';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'sessionStrategy',
      message: 'Choose session strategy:',
      choices: ['JWT (Stateless)', 'Database (Stateful)'],
      default: 'JWT (Stateless)',
    },
    {
      type: 'list',
      name: 'database',
      message: 'Select database (if using database sessions):',
      choices: ['None', 'Prisma + PostgreSQL', 'Prisma + MySQL', 'Prisma + MongoDB', 'Prisma + SQLite'],
      default: 'None',
      when: (answers) => answers.sessionStrategy === 'Database (Stateful)',
    },
    {
      type: 'confirm',
      name: 'rbac',
      message: 'Setup Role-Based Access Control (RBAC)?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'emailVerification',
      message: 'Setup Email Verification?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'protectedRoutes',
      message: 'Generate protected route examples?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies automatically?',
      default: true,
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    await setup(answers);
  } catch (error) {
    console.error(chalk.red('\n❌ Setup failed:'), error.message);
    process.exit(1);
  }
}

main();
