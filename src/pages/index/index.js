
Page({
  onLoad () {
    this.show()
  },
  print () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Date now:', Date.now())
        resolve()
      }, 1000)
    })
  },
  async show () {
    for (let i = 0; i < 10; i++) {
      await this.print()
    }
  }
})
