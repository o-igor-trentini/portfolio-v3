// Enforce Conventional Commits (feat/fix/chore/…) — the convention the history
// already follows by hand. Checked by the Husky `commit-msg` hook.
const config = { extends: ["@commitlint/config-conventional"] };
export default config;
