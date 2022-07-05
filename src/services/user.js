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

/**
 * 更新用户信息
 * @param {Object} param0 要修改的内容 { newPassword, newNickName, newPicture, newCity }
 * @param {Object} param1 查询条件 { userName, password }
 */

const updateUser = async (
  { newPassword, newNickName, newPicture, newCity },
  { userName, password }
) => {
  const updateData = {}
  newPassword && (updateData.password = newPassword)
  newNickName && (updateData.nickName = newNickName)
  newPicture && (updateData.picture = newPicture)
  newCity && (updateData.city = newCity)

  const whereData = {
    userName,
  }
  password && (whereData.password = password)

  const result = await User.update(updateData, {
    where: whereData,
  })
  return result[0] > 0
}

module.exports = {
  getUserInfo,
  createUser,
  deleteUser,
  updateUser,
}
