/**
 * Created by Administrator on 2017/7/20 0020.
 */

describe('a spec',function () {
    const User = require('../app/model/user')
    var a;

    beforeAll(function () {
        var mongoose = require('mongoose');
        const dbUrl = 'mongodb://127.0.0.1:27017/movie';
        mongoose.connect(dbUrl);

        mongoose.Promise = global.Promise;
    })
    beforeEach(function () {
        a = 1;
    });
    it('should have just a test',function (done) {
        User.fetch(function (err,users) {
            expect(users.length).toBe(6);
            done();
        })
    })
});