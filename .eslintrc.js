module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: "standard",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"], // 是使用CRLF还是LF
    quotes: ["error", "single"],
    semi: ["error", "never"]
  },
  globals: {
    App: true,
    Page: true,
    Component: true,
    wx: true,
    getApp: true,
    getCurrentPages: true
  }
};
