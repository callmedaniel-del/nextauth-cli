const chalk = require('chalk');

function showWelcome() {
  console.log('\n');
  console.log(chalk.cyan.bold('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('║         🔐 NextAuth.js CLI Setup Wizard 🔐                ║'));
  console.log(chalk.cyan.bold('║                                                            ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝'));
  console.log('\n');
  console.log(chalk.green('✨ Welcome to the NextAuth.js CLI Setup Wizard!'));
  console.log(chalk.gray('This wizard will help you scaffold NextAuth.js authentication'));
  console.log(chalk.gray('in your Next.js project in just a few clicks.\n'));
}

function showSuccess() {
  console.log('\n');
  console.log(chalk.green.bold('✨ Setup Complete! 🎉\n'));
  console.log(chalk.cyan('📋 Next Steps:'));
  console.log(chalk.white('  1. Copy .env.example to .env.local'));
  console.log(chalk.white('  2. Add your OAuth credentials'));
  console.log(chalk.white('  3. Run: npm run dev'));
  console.log(chalk.white('  4. Visit http://localhost:3000/auth/signin\n'));
}

function getProviderConfig(provider) {
  const configs = {
    'Google OAuth': {
      name: 'google',
      import: 'import GoogleProvider from "next-auth/providers/google";',
      config: 'GoogleProvider({\n      clientId: process.env.GOOGLE_ID,\n      clientSecret: process.env.GOOGLE_SECRET,\n    })',
      env: 'GOOGLE_ID=your_google_client_id\nGOOGLE_SECRET=your_google_client_secret',
    },
    'GitHub OAuth': {
      name: 'github',
      import: 'import GithubProvider from "next-auth/providers/github";',
      config: 'GithubProvider({\n      clientId: process.env.GITHUB_ID,\n      clientSecret: process.env.GITHUB_SECRET,\n    })',
      env: 'GITHUB_ID=your_github_client_id\nGITHUB_SECRET=your_github_client_secret',
    },
    'Apple OAuth': {
      name: 'apple',
      import: 'import AppleProvider from "next-auth/providers/apple";',
      config: 'AppleProvider({\n      clientId: process.env.APPLE_ID,\n      teamId: process.env.APPLE_TEAM_ID,\n      keyId: process.env.APPLE_KEY_ID,\n      privateKey: process.env.APPLE_PRIVATE_KEY,\n    })',
      env: 'APPLE_ID=your_apple_id\nAPPLE_TEAM_ID=your_team_id\nAPPLE_KEY_ID=your_key_id\nAPPLE_PRIVATE_KEY=your_private_key',
    },
    'Facebook OAuth': {
      name: 'facebook',
      import: 'import FacebookProvider from "next-auth/providers/facebook";',
      config: 'FacebookProvider({\n      clientId: process.env.FACEBOOK_ID,\n      clientSecret: process.env.FACEBOOK_SECRET,\n    })',
      env: 'FACEBOOK_ID=your_facebook_id\nFACEBOOK_SECRET=your_facebook_secret',
    },
    'Email Magic Links': {
      name: 'email',
      import: 'import EmailProvider from "next-auth/providers/email";',
      config: 'EmailProvider({\n      server: process.env.EMAIL_SERVER,\n      from: process.env.EMAIL_FROM,\n    })',
      env: 'EMAIL_SERVER=smtp://user:password@smtp.example.com:587\nEMAIL_FROM=noreply@example.com',
    },
    'Credentials': {
      name: 'credentials',
      import: 'import CredentialsProvider from "next-auth/providers/credentials";',
      config: 'CredentialsProvider({\n      credentials: {\n        username: { label: "Username", type: "text" },\n        password: { label: "Password", type: "password" },\n      },\n      authorize: async (credentials) => {\n        // Add your own logic here\n        return { id: "1", name: "User", email: "user@example.com" };\n      },\n    })',
      env: '# No environment variables needed for Credentials',
    },
  };
  return configs[provider] || {};
}

module.exports = {
  showWelcome,
  showSuccess,
  getProviderConfig,
};
