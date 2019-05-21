/**
 * Created by MaDeaw on 2/8/2018.
 */
function calllogout(callback) {
    $.ajax({
        url: '/casino_common/logoutcms',
        type: 'POST',
        method: 'POST',
        data: {},
        success: function (res) {
            if (callback) {
                callback(res)
            }
        },
        error: function (e) {
            callback(e)
        }
    });
}
function calllogin(res, callback) {
    $.ajax({
        url: '/casino_common/logincms',
        type: 'POST',
        method: 'POST',
        data: {
            username: res.userID,
            auth: res.isAuthenticated,
            email: res.email,
            firstname :  res.firstname,
            telephone : res.mobile
        },
        success: function (res) {
            if (callback) {
                callback(res)
            }
        },
        error: function (e) {
            callback(e)
        }
    });
}
