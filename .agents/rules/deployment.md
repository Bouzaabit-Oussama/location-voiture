---
description: Rule for automatic version bumping and deployment
---

# Deployment and Versioning Rule

**CRITICAL RULE:**
Whenever you modify the application and push changes to the repository, you MUST follow these steps before executing the git push command:

1. Locate the file `src/lib/version.ts`.
2. Increment the patch version (e.g., from `1.0.1` to `1.0.2`) inside this file.
3. Include the `version.ts` file in your git commit.
4. Execute `git push origin main` so that the change deploys immediately via Vercel.

This ensures the user can visually confirm via the UI (sidebar header) that the newest deployment is fully live and Vercel has finished building.
