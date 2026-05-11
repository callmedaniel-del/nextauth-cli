# Contributing to NextAuth CLI

Thank you for your interest in contributing to NextAuth CLI! This document provides guidelines and instructions for contributing.

---

## 🐛 Reporting Bugs

Before creating a bug report, please check the issue tracker to avoid duplicates.

**When creating a bug report, include:**

- Clear title and description
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- OS, Node.js version, and npm version
- Any relevant error messages or logs

---

## 🎨 Suggesting Enhancements

**When suggesting an enhancement, include:**

- Clear title and description
- Motivation and use case
- Possible implementation approach (if applicable)
- Examples of how the feature would be used

---

## 📝 Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages: `git commit -m 'Add feature: description'`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request with a clear description

---

## 🎯 Areas for Contribution

- **New Providers** - Add support for additional OAuth providers
- **Documentation** - Improve guides, examples, and API docs
- **Tests** - Add unit tests and integration tests
- **Bug Fixes** - Fix reported issues
- **Performance** - Optimize code and reduce bundle size
- **Templates** - Add starter templates and examples

---

## 📦 Development Setup

```bash
# Clone the repository
git clone https://github.com/callmedaniel-del/nextauth-cli.git
cd nextauth-cli

# Install dependencies
npm install

# Link locally
npm link

# Test the CLI
nextauth-cli
```

---

## 💻 Code Style

- Use 2-space indentation
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the existing code structure

---

## ✅ Testing

Test your changes in a fresh Next.js project:

```bash
# Create test project
npx create-next-app@latest test-app
cd test-app

# Link your local nextauth-cli
npm link ../nextauth-cli

# Run the CLI
nextauth-cli

# Test the generated files
npm install next-auth
npm run dev
```

---

## 📄 Commit Message Guidelines

- Use imperative mood: "add feature" not "added feature"
- Limit the first line to 72 characters
- Reference issues when applicable: "Fixes #123"

---

## 🙏 Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.

---

**Thank you for contributing! 🎉**
