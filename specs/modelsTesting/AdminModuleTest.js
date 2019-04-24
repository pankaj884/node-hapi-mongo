var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Admin extends Model {

}

// return




// const admin = new Admin('admin')

// admin.setData({

// })

describe('Testing crud module admin ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create admin model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                admin.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get admin model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          admin.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit admin model', function(done){

          admin.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete admin model', function(done){

          admin.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all admin', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          admin.get(function(err , data){
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

module.exports = Admin
