const seq = require('../seq')
const { STRING, TEXT, INTEGER } = require('../types')

const Blog = seq.define('blog', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '用户id',
  },
  content: {
    type: TEXT,
    allowNull: false,
    comment: '博客内容',
  },
  image: {
    type: STRING,
    comment: '博客图片',
  },
})

module.exports = Blog
