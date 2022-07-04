/**
 * @description 登录验证的中间件
 */

const { ErrorModel } = require('../model/ResModel')
const { loginCheckFailInfo } = require('../model/ErrorInfo')

/**
 * API 登录验证
 * @param {Object} ctx ctx
 * @param {function} next next
 */

const loginCheck = async (ctx, next) => {
  if (ctx.session && ctx.session.userInfo) {
    return await next()
  }

  ctx.body = new ErrorModel(loginCheckFailInfo)
}

const loginRedirect = async (ctx, next) => {
  if (ctx.session && ctx.session.userInfo) {
    return await next()
  }

  const url = `/login?url=${encodeURIComponent(ctx.url)}`
  ctx.redirect(url)
}

module.exports = {
  loginCheck,
  loginRedirect,
}
