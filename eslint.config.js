// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import tseslint from 'typescript-eslint'
// import { defineConfig, globalIgnores } from 'eslint/config'
//
// export default defineConfig([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs['recommended-latest'],
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ])
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    // Ignora cosas comunes
    {
        ignores: [
            "dist",
            "build",
            "node_modules",
            "*.min.*",
            "coverage",
            ".husky",
            ".idea",
        ],
    },

    // Base JS
    js.configs.recommended,

    // TypeScript (incluye parser y reglas recomendadas)
    ...tseslint.configs.recommendedTypeChecked, // usa type-aware rules
    // Si aún no usas project references, puedes cambiar a `recommended` y
    // quitar parserOptions.project más abajo.

    // React + JSX + Accesibilidad
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": hooks,
            "jsx-a11y": jsxA11y,
            "simple-import-sort": simpleImportSort,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                project: ["./tsconfig.json"], // necesario para rules type-aware
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: {
                version: "detect", // React 19: autodetect
            },
        },
        rules: {
            /* React / Hooks */
            "react/jsx-uses-react": "off", // React 17+ runtime automático
            "react/react-in-jsx-scope": "off",
            "react/no-unknown-property": ["error", { ignore: ["css"] }], // útil si usas Emotion
            "react/prop-types": "off", // usamos TS
            ...hooks.configs.recommended.rules,

            /* Accesibilidad */
            ...jsxA11y.configs.recommended.rules,

            /* TypeScript: ajustes prácticos */
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports", fixStyle: "inline-type-imports" },
            ],
            "@typescript-eslint/no-floating-promises": "error",

            /* Orden / limpieza de imports */
            "simple-import-sort/imports": [
                "warn",
                {
                    groups: [
                        // Paquetes externos y polyfills
                        ["^react", "^[^.]"],
                        // Alias y paths (si usas baseUrl/paths en tsconfig)
                        ["^@/"],
                        // Imports relativos: primero padres, luego hermanos, luego index
                        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                        ["^\\./(?!/?$)", "^\\./?$"],
                        ["^\\.\\./?\\w+/?$", "^\\./?\\w+/?$"],
                        // Estilos
                        ["^.+\\.s?css$"],
                    ],
                },
            ],
            "simple-import-sort/exports": "warn",

            /* Otras buenas prácticas */
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",
        },
    },

    // Desactiva cualquier regla que choque con Prettier
    eslintConfigPrettier,
];
