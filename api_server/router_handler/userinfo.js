const db = require('../db/index')

const bcrypt = require('bcryptjs')


exports.getUserType = (req, res) => {
    try {
        res.send({
            status: 0,
            message: '获取用户类型成功',
            userType: req.auth.role
        })
    } catch (err) {
        console.log(err)
    }
}


// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // const sql = `SELECT id, username, name, phone, email
    //             FROM UserClientInfo
    //             WHERE id=?`
    const sql = "SELECT * from UserClientInfo WHERE id=?"
    // console.log("auth: " + req.auth)
    // console.log("json: "+req.auth.json())
    // console.log(req.auth.id)
    // return res.send(req.auth)
    db.query(sql, req.auth.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败')

        res.send({
            status: 0,
            message: 'Get the user basic information successfully!',
            userInfo: results[0],
        })
    })
    
}

// get agent's information
// exports.getAgentInfo = (req, res) => {
exports.getAgentInfoById = (req, res) => {
    let id = null; // or undefined
    if (req.query.id) {
        id = req.query.id;
    } else if (!req.query.id) {
        if (!req.auth.id) return res.cc('No id');
        id = req.auth.id;
    }
    console.log(id)
    const sql = "SELECT * from agent WHERE user_id=?";
    db.query(sql, id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取经纪人信息失败');
        res.send({
            status: 0,
            message: 'Get the agent information successfully!',
            agentInfo: results[0],
        });
    });
};


    


// update User's Information
exports.updateUserInfo = (req, res) => {
    const { name, phone, email } = req.body
    console.log(req.body)
    console.log(req.auth.id)
    console.log(phone)
    console.log(email)
    const sql = 'update ClientInfo set name=?, phone=?, email=? where id=?'
    db.query(sql, [name, phone, email, req.auth.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新用户信息失败！')
        res.cc('update user information successfully', 0)
    })
}

// update Password
exports.updatePassword = (req, res) => {
    console.log('pwd')
    console.log(req.body)
    const sql = 'select * from User where id=?'
    db.query(sql, req.auth.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('The User Not Exist!')

        // TODO

        //check if old password is right
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('Old Password is Wrong!')

        newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // update password
        const sql = 'update User set password = ? where id=?'
        db.query(sql, [newPwd, req.auth.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('update password successfully', 0)
        })
    })
}

//tables updated useless now
// update Avatar
exports.updateAvatar = (req, res) => {
    const sql = 'update User set user_pic=? where id=?'

    db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
}
