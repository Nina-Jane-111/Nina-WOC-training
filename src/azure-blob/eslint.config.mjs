import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended, // This provides the "extends: js/recommended" logic automatically
    {
        files: ["**/*.{js,mjs,cjs}", "**/*.test.js", "**/__tests__/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node, // Added node globals since you're likely using Azure functions/Node
                ...globals.jest, // This defines describe, test, expect, beforeEach, etc.
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error"
        }
    }
];