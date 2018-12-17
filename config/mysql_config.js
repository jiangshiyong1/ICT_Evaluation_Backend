var mysql = require('mysql');
var config = require('./defaultConfig');

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

let allServices = {
    query: function (sql, values) {

        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {

                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })

    },
   findUserData: function () {
        let _sql = `select * from users;`
        return allServices.query(_sql)
    },
    addUserData: (obj) => {
         let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
         return allServices.query(_sql, obj)
    },
    login: (obj) => {
        let _sql = `select * from users where login = ? and password = ?`
        return allServices.query(_sql, obj)
    },
    getUserTbale: function(id) {
        let _sql = `SELECT u.summary_table, u.isdone, u.key,s.detail,s.id sid,u.key word, u.id,u.key,u.username,s.score FROM users u LEFT JOIN summary s ON u.id = s.s_id and u.id AND s.u_id = ${id} where u.department <> 10 order by u.key`
        return allServices.query(_sql)
    },
    getSummary : function (obj) {
        let _sql = "select * from summary where u_id = ? and s_id = ?"
        return allServices.query(_sql, obj)
    },
    saveSummary: function (obj) {
        let _sql = "insert into summary set detail=?,score=?,u_id=?,s_id=?;"
        return allServices.query(_sql, obj)
    },
    updateSummary: function (obj) {
        let _sql = `UPDATE summary SET detail = ?, score = ? WHERE id = ${obj[4]}`
        return allServices.query(_sql, obj)
    },
    checkpasd (obj) {
        let _sql = "select * from users where password = ? and id = ?"
        return allServices.query(_sql, obj)
    },
    resetpsd (obj) {
        let isql = `update users set password = ?,reset_pas = 1 where id = ?`
        return allServices.query(isql, obj)
    },
    commit (obj) {
        let isql = `update users set isdone = 1 where id = ?`
        return allServices.query(isql, obj)
    }
}

module.exports = allServices;