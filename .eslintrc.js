module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaVersion": 2015
  },
  "rules": {
      "indent": [
          "error",
          2,
          {
              "SwitchCase": 1
          }
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "always"
      ],
      "no-console": 'off'
  }
};