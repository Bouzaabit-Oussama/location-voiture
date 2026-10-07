# UI/UX Workflow and Standards

The user expects a premium, enterprise-grade UI/UX for the `location-voiture` SaaS. The standard has been explicitly defined as needing to impress the user, comparing to top-tier modern SaaS platforms.

## Core UI/UX Agents Workflow
When working on UI and frontend features, agents must divide tasks into three primary roles:

1. **`agent-ui-architect`**: Focuses on the layout structure, Tailwind v4 class implementation, responsiveness, and overall user journey. Ensures all designs follow modern patterns (glassmorphism, subtle borders, high contrast).
2. **`agent-shadcn-builder`**: Dedicated to fetching, installing, and customizing `shadcn/ui` components. Avoids writing custom components when a standard `shadcn/ui` equivalent exists. Customizes component themes to match our executive dark mode.
3. **`agent-visual-qa`**: Responsible for reviewing the resulting UI for visual bugs, contrast issues, alignment, accessibility, and ensuring the "WOW factor."

## Design Guidelines
- **Color Palette**: Stick to sophisticated palettes (e.g., slate, zinc, emerald for success). Avoid generic bright colors.
- **Typography**: Utilize the configured modern fonts cleanly with adequate whitespace.
- **Components**: Prefer `shadcn/ui` initialized components over raw HTML elements.
- **Feedback**: Provide micro-interactions (hover states, focus rings, loading states) for all interactive elements.

## Execution Rules
- Always run `npx shadcn@latest add <component>` rather than copy-pasting component code manually if possible.
- Adhere strictly to the Next.js App Router paradigm.
