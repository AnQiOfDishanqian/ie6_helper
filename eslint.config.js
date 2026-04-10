import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // IE6 polyfill project: var is required for ES3/ES5 compat
      "no-var": "off",
      // any is heavily used since we're patching dynamic prototypes
      "@typescript-eslint/no-explicit-any": "off",
      // Function type is needed for polyfill signatures
      "@typescript-eslint/no-unsafe-function-type": "off",
      // this aliasing is needed in polyfill closures
      "@typescript-eslint/no-this-alias": "off",
      // arguments object is needed for IE6 compat (no rest params in output)
      "prefer-rest-params": "off",
      // Control chars in regex are intentional for JSON polyfill
      "no-control-regex": "off",
      // Regex char classes in JSON polyfill are intentional
      "no-misleading-character-class": "off",
      // Escape chars in JSON regex are intentional for validation
      "no-useless-escape": "off",
      // prototype methods need to be called from target object for IE6
      "no-prototype-builtins": "off",
      // Unused vars
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      // Empty blocks are fine
      "no-empty": "off"
    }
  },
  {
    ignores: ["dist/**", "node_modules/**"]
  }
);
