var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class UserTags extends Model {

}

return




const userTags = new UserTags('userTags')

userTags.setData({

})

describe('Testing crud module userTags ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create userTags model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                userTags.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get userTags model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          userTags.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit userTags model', function(done){

          userTags.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete userTags model', function(done){

          userTags.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all userTags', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          userTags.get(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

});

module.exports = UserTags
