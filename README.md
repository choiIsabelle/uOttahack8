# uOttahack8

Project uses OpenRouter SDK to evaluate the efficiency of several Large Language Models when processing a user task.
The results are evaluated objectively utilzing modern machine learning processes.

Techstack:
Front-end: React with Typescript, styled with Tailwind CSS
Back-end: Python
Hosting: Github pages and AWS Lambda

## Deployment — GitHub Pages

This repository is configured to automatically build and deploy to GitHub Pages whenever you push to the `main` branch.

What I added:

- A GitHub Actions workflow (`.github/workflows/gh-pages.yml`) that runs on push to `main`, builds the app with `npm run build`, and deploys the generated `dist/` folder to the `gh-pages` branch using `JamesIves/github-pages-deploy-action`.

Notes and first-time steps:

1. Make sure your repository is hosted on GitHub at `https://github.com/<owner>/<repo>` (looks like `choiIsabelle/uOttahack8`).
2. The workflow uses the repository's `GITHUB_TOKEN` so no extra secrets are required.
3. After the workflow runs, enable GitHub Pages in the repository settings (Settings → Pages) and choose the `gh-pages` branch as the source if it isn't selected automatically. The action usually configures the branch for you; if not, set it manually.
4. You can also preview locally with:

```bash
npm install
npm run dev
```

If you'd like, I can change the workflow to deploy on tags or from other branches, or use `peaceiris/actions-gh-pages` instead. Let me know which you prefer.
