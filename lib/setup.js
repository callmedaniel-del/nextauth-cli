const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { exec } = require('child_process');
const { promisify } = require('util');
const {
  generateNextAuthRoute,
  generateSignInComponent,
  generateDashboard,
  generateRbacUtils,
  generateEmailVerification,
  generateProtectedApi,
  generateMiddleware,
  generateEnvExample,
  generatePrismaSchema,
} = require('./generators');
const { showSuccess } = require('./utils');

const execAsync = promisify(exec);

function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDirectoryIfNotExists(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

async function setup(answers) {
  const spinner = ora();
  const cwd = process.cwd();

  try {
    // Create auth directory structure
    spinner.start('Creating auth directory structure...');
    createDirectoryIfNotExists(path.join(cwd, 'app/api/auth/[...nextauth]'));
    createDirectoryIfNotExists(path.join(cwd, 'components/auth'));
    createDirectoryIfNotExists(path.join(cwd, 'lib/auth'));
    spinner.succeed('Created auth directory structure');

    // Generate NextAuth route
    spinner.start('Generating [...nextauth] route handler...');
    const nextAuthRoute = generateNextAuthRoute(answers.providers, answers.sessionStrategy);
    writeFile(path.join(cwd, 'app/api/auth/[...nextauth]/route.ts'), nextAuthRoute);
    spinner.succeed('Generated [...nextauth] route handler');

    // Generate Sign-In component
    spinner.start('Creating Sign-In component...');
    const signInComponent = generateSignInComponent();
    writeFile(path.join(cwd, 'components/auth/SignIn.tsx'), signInComponent);
    spinner.succeed('Created Sign-In component');

    // Generate Dashboard
    if (answers.protectedRoutes) {
      spinner.start('Setting up protected dashboard...');
      const dashboard = generateDashboard();
      writeFile(path.join(cwd, 'app/dashboard/page.tsx'), dashboard);
      spinner.succeed('Set up protected dashboard');
    }

    // Generate RBAC
    if (answers.rbac) {
      spinner.start('Adding RBAC utilities...');
      const rbac = generateRbacUtils();
      writeFile(path.join(cwd, 'lib/auth/rbac.ts'), rbac);
      spinner.succeed('Added RBAC utilities');
    }

    // Generate Email Verification
    if (answers.emailVerification) {
      spinner.start('Setting up email verification...');
      const emailVerif = generateEmailVerification();
      writeFile(path.join(cwd, 'lib/auth/email-verification.ts'), emailVerif);
      spinner.succeed('Set up email verification');
    }

    // Generate Protected API
    spinner.start('Generating API protection helpers...');
    const protectedApi = generateProtectedApi();
    writeFile(path.join(cwd, 'lib/auth/protectedApi.ts'), protectedApi);
    spinner.succeed('Generated API protection helpers');

    // Generate Middleware
    spinner.start('Creating middleware...');
    const middleware = generateMiddleware();
    writeFile(path.join(cwd, 'middleware.ts'), middleware);
    spinner.succeed('Created middleware');

    // Generate .env.example
    spinner.start('Generating .env.example...');
    const envExample = generateEnvExample(answers.providers);
    writeFile(path.join(cwd, '.env.example'), envExample);
    spinner.succeed('Generated .env.example');

    // Generate Prisma schema if database is selected
    if (answers.database && answers.database !== 'None') {
      spinner.start('Generating Prisma schema...');
      const prismaSchema = generatePrismaSchema(answers.database);
      writeFile(path.join(cwd, 'prisma/schema.prisma'), prismaSchema);
      spinner.succeed('Generated Prisma schema');
    }

    // Install dependencies
    if (answers.installDeps) {
      spinner.start('Installing dependencies...');
      try {
        await execAsync('npm install next-auth', { cwd });
        spinner.succeed('Installed next-auth');

        if (answers.emailVerification) {
          spinner.start('Installing additional dependencies...');
          await execAsync('npm install nodemailer', { cwd });
          spinner.succeed('Installed nodemailer');
        }
      } catch (error) {
        spinner.warn('Could not auto-install dependencies. Please run: npm install next-auth');
      }
    }

    showSuccess();
  } catch (error) {
    spinner.fail('Setup failed');
    throw error;
  }
}

module.exports = {
  setup,
};
