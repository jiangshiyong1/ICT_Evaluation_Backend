const router = require('koa-router')()
const userService = require('../config/mysql_config');

router.prefix('/users')

//获取所有用户(GET请求)
router.get('/', async (ctx, next) => {
    // console.log(ctx.session.username)
    ctx.body = await userService.findUserData();
})
//获取评价表
router.get('/summary', async (ctx, next) => {
    ctx.body = await userService.getUserTbale(ctx.query.id);
})
//登陆
router.post('/login', async (ctx, next) => {
    var arr = [ctx.request.body.username, ctx.request.body.password]
    ctx.body = await userService.login(arr)
})

//打分
router.post('/saveSummary', async (ctx, next) => {
    let arr = [ctx.request.body.detail, ctx.request.body.score, ctx.request.body.u_id, ctx.request.body.s_id ,ctx.request.body.sid]
    let res = await userService.getSummary([ctx.request.body.u_id, ctx.request.body.s_id])
    
    if (res.length != 0) {
        arr[4] = res[0].id
        console.log(res[0].id)
        ctx.body = await userService.updateSummary(arr)
    } else {
        ctx.body = await userService.saveSummary(arr)
    }
})

//修改密码
router.post('/resetpsd', async (ctx, next) => {
    var arr = [ctx.request.body.opsd, ctx.request.body.uid, ctx.request.body.npsd]
    let res = await userService.checkpasd(arr)
    if (res.length == 0) {
        ctx.body = []
    } else {
        ctx.body = await userService.resetpsd([ ctx.request.body.npsd, ctx.request.body.uid])
    }
})

//提交
router.post('/commit', async (ctx, next) => {
    var arr = [ctx.request.body.uid]
    ctx.body = await userService.commit(arr)
})

// 增加用户(POST请求)
router.post('/add', async (ctx, next) => {
    let arr = [];

    arr.push(ctx.request.body['name']);
    arr.push(ctx.request.body['pass']);
    arr.push(ctx.request.body['auth']);

    await userService.addUserData(arr)
        .then((data) => {
            let r = '';
            if (data.affectedRows != 0) {
                r = 'ok';
            }
            ctx.body = {
                data: r
            }
        }).catch(() => {
            ctx.body = {
                data: 'err'
            }
        })
})

module.exports = router
