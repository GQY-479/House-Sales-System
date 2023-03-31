const express = require('express')
const router = express.Router()

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {update_userinfo_schema, update_password_schema, update_avatar_schema} = require('../schema/user')


const userinfo_handler = require('../router_handler/userinfo')
router.get('/usertype', userinfo_handler.getUserType)
router.get('/userinfo', userinfo_handler.getUserInfo)
router.post('/update/profile', expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)
router.post('/updatepwd', expressJoi(update_password_schema),userinfo_handler.updatePassword)

// router.post('/update/avatar', expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)

// agent
router.get('/agentinfo', userinfo_handler.getAgentInfoById)

// http://127.0.0.1:3007/my/updatepwd
function requireRole(role) {
  return (req, res, next) => {
    if (req.auth.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
/*
// Usage in your routes
app.get('/api/agent/list-customers', requireRole('agent'), agentController.listCustomers);
app.post('/api/agent/add-house', requireRole('agent'), agentController.addHouse);
app.get('/api/customer/list-houses', requireRole('customer'), customerController.listHouses);
app.post('/api/customer/provide-house', requireRole('customer'), customerController.provideHouse);
*/

module.exports = router