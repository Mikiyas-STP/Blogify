### **1. The `CONTRIBUTING.md` File**

**Action:** In the **root folder** of your `blogify` project, create a new file named `CONTRIBUTING.md` and paste the following content.

```markdown
# Contributing to Blogify

First off, thank you for considering contributing to Blogify! We're thrilled you're interested in making this project better. Whether you're reporting a bug, suggesting a new feature, or writing code, your contribution is greatly appreciated.

This document provides a set of guidelines to ensure that collaborating on this project is a smooth and effective process for everyone.

## Code of Conduct

To ensure a welcoming and inclusive environment for everyone, this project and everyone participating in it is governed by the [Blogify Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

There are several ways you can contribute to the project:

### Reporting Bugs
If you find a bug, please ensure it hasn't already been reported by searching the project's **Issues** on GitHub. If you can't find an existing issue, please open a new one.

When filing a bug report, please be sure to include:
*   A clear and descriptive title.
*   A step-by-step description of how to reproduce the bug.
*   What you expected to happen and what actually happened.
*   Any relevant error messages or screenshots.

### Suggesting Enhancements
If you have an idea for a new feature or an improvement to an existing one, please open an issue on GitHub to start a discussion. This allows us to align on the feature before any code is written.

Please be as detailed as possible in your suggestion, explaining the "why" (the problem it solves) and the "what" (how it would work).

### Your First Code Contribution
Ready to contribute some code? Here is the standard workflow for submitting a change.

1.  **Fork the Repository:** Start by forking the project to your own GitHub account.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/blogify-pern-project.git
    ```
3.  **Create a New Branch:** Create a branch for your changes. Please use a descriptive name that follows our naming convention: `feat/<feature-name>` for new features, or `fix/<bug-name>` for bug fixes.
    ```bash
    git checkout -b feat/add-user-avatars
    ```
4.  **Set Up the Development Environment:** Follow the instructions in the `README.md` to install all dependencies for both the `client` and `server` and to set up your local database and `.env` file.
5.  **Make Your Changes:** Write your code! Ensure it follows the existing code style.
6.  **Commit Your Changes:** Commit your work with a clear, conventional commit message.
    ```bash
    git add .
    git commit -m "feat(profile): Add user avatar upload functionality"
    ```
7.  **Push to Your Fork:** Push your new branch to your forked repository on GitHub.
    ```bash
    git push origin feat/add-user-avatars
    ```
8.  **Open a Pull Request (PR):** Go to the original Blogify repository on GitHub. You will see a prompt to create a Pull Request from your new branch. Please fill out the PR template with a clear description of your changes.

## Styleguides

### Git Commit Messages
This project uses **Conventional Commits**. Please ensure your commit messages follow this format.
*   Use types like `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`.
*   The subject line should be a concise, imperative statement (e.g., `feat(auth): Add password reset flow`).

### Pull Request Titles
PR titles should also follow the Conventional Commits format. This makes the project history clean and easy to read.

### JavaScript Style
This project follows standard modern JavaScript practices. While we don't have a strict linter set up yet, please aim for:
*   Consistent indentation and formatting.
*   Clear and descriptive variable names.
*   Adherence to the existing patterns in the codebase.

Thank you again for your interest in contributing!
```

---

### **2. The `CODE_OF_CONDUCT.md` File**

**Action:** In the **root folder** of your `blogify` project, create a new file named `CODE_OF_CONDUCT.md` and paste the following content. This is based on a standard, widely used template.

```markdown
# Contributor Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our community include:
*   Demonstrating empathy and kindness toward other people
*   Being respectful of differing opinions, viewpoints, and experiences
*   Giving and gracefully accepting constructive feedback
*   Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience
*   Focusing on what is best not just for us as individuals, but for the overall community

Examples of unacceptable behavior include:
*   The use of sexualized language or imagery, and sexual attention or advances of any kind
*   Trolling, insulting or derogatory comments, and personal or political attacks
*   Public or private harassment
*   Publishing others' private information, such as a physical or email address, without their explicit permission
*   Other conduct which could reasonably be considered inappropriate in a professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces. Examples of representing our community include using an official e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement at [YOUR EMAIL ADDRESS - OR LEAVE THIS AS A PLACEHOLDER]. All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the reporter of any incident.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 2.0,
available at [https://www.contributor-covenant.org/version/2/0/code_of_conduct.html][v2.0].

[homepage]: https://www.contributor-covenant.org
[v2.0]: https://www.contributor-covenant.org/version/2/0/code_of_conduct.html
```
