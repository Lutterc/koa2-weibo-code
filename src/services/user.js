const { User } = require('../db/model')
const { formatUser } = require('./_format')
/**
 * 获取用户信息
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
const getUserInfo = async (userName, password) => {
  const whereOpt = {
    userName,
  }

  password && (whereOpt.password = password)

  const result = await User.findOne({
    attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
    where: whereOpt,
  })

  if (result === null) return result

  const formatResult = formatUser(result.dataValues)

  return formatResult
}

/**
 * 创建用户
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender 性别
 * @param {string} nickName 昵称
 */
const createUser = async ({ userName, password, gender = 3, nickName }) => {
  const result = await User.create({
    userName,
    password,
    gender,
    nickName: nickName ? nickName : userName,
  })

  const data = result.dataValues

  return data
}

/**
 * 删除用户
 * @param {string} userName 用户名
 */
const deleteUser = async (userName) => {
  const result = await User.destroy({
    where: { userName },
  })

  return result > 0
}

module.exports = {
  getUserInfo,
  createUser,
  deleteUser,
}
