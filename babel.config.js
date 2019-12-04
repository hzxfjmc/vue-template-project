module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    [
      "import",
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: name => `${name}/style/less`,
      },
      "vant"
    ],
    [
      "import",
      {
        libraryName: 'vant-fork',
        libraryDirectory: 'src',
         style: name => `${name}/index.less`,
      },
      "vant-fork"
    ],
  ]
}
