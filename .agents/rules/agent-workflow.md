# Agent Workflow Rules

## Phase Transitions and Planning
1. **Never Stop Abruptly**: When concluding a phase of work (e.g., finishing a UI overhaul, completing a feature implementation), do NOT simply stop or wait idly for the next prompt.
2. **End with a Plan**: Every completion of a phase MUST end by presenting a concrete, detailed plan for the **next phase** of development. 
3. **Continuous Execution**: Keep the agent loop active by proposing the next steps logically derived from the project's current state and roadmap, and ask the user for confirmation to immediately proceed to that next phase.
