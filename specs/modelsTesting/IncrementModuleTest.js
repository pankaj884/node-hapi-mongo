var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Increment extends Model {

}

return




const increment = new Increment('increment')

increment.setData({

})

describe('Testing crud module increment ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create increment model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                increment.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get increment model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          increment.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit increment model', function(done){

          increment.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete increment model', function(done){

          increment.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all increment', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          increment.get(function(err , data){
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

module.exports = Increment
