const router = require('koa-router')()
const koaFrom = require('formidable-upload-koa')

const { loginCheck } = require('../../middlewares/loginChecks')
const { saveFile } = require('../../controller/utils')

router.prefix('/api/utils')

router.post('/upload', loginCheck, koaFrom(), async (ctx, next) => {
  const file = ctx.req.files['file']
  if (!file) return

  const { sizew, path, type, name } = file
  ctx.body = await saveFile({ sizew, type, name, filePath: path })
})

module.exports = router
