import js from "@eslint/js";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default [
    // Use ESLint's recommended configuration as base
    js.configs.recommended,

    {
        // Define global variables for Next.js
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                JSX: true,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        // Configure plugins
        plugins: {
            "@next/next": nextPlugin,
            "react": reactPlugin,
            "react-hooks": reactHooksPlugin,
            "import": importPlugin,
        },

        // Define settings
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },

        rules: {
            // Next.js specific rules
            "@next/next/no-html-link-for-pages": "error",
            "@next/next/no-img-element": "error",
            "@next/next/no-unwanted-polyfillio": "warn",
            "@next/next/no-sync-scripts": "error",

            // React specific rules
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/prop-types": "off", // Optional: disable prop-types when using TypeScript
            "react/react-in-jsx-scope": "off", // Not needed in Next.js
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Import rules
            "import/no-unresolved": "error",
            "import/named": "error",
            "import/default": "error",
            "import/namespace": "error",
            "import/export": "error",
            "import/order": ["error", {
                "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
                "newlines-between": "always",
                "alphabetize": {
                    "order": "asc",
                    "caseInsensitive": true
                }
            }],

            // General JavaScript/ES6+ rules
            "no-unused-vars": ["error", { 
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "no-console": ["warn", { 
                allow: ["warn", "error"] 
            }],
            "prefer-const": "error",
            "no-var": "error",
        },

        // Ignore patterns
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "public/**",
            "*.config.js",
            "*.config.mjs",
        ],
    },
];