const seq = require('./seq')

require('./model')

seq
  .authenticate()
  .then(() => {
    console.log('auth success')
  })
  .catch(() => {
    console.log('auth fail')
  })

seq.sync({ force: true }).then(() => {
  console.log('sync success')
  process.exit()
})
