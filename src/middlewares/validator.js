const { ErrorModel } = require('../model/ResModel')
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')

/**
 * 生成 json schema 验证的中间件
 * @param {function} validateFn 验证函数
 */
const genValidator = (validateFn) => {
  return async (ctx, next) => {
    const data = ctx.request.body
    const result = validateFn(data)
    if (result) return (ctx.body = new ErrorModel(jsonSchemaFileInfo))
    await next()
  }
}

module.exports = { genValidator }
