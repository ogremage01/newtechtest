import nextConfig from "eslint-config-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...(Array.isArray(nextConfig) ? nextConfig : [nextConfig]),
  { ignores: ["**/node_modules/**", "**/.next/**", "**/out/**", "**/dist/**", "**/build/**"] },
];
