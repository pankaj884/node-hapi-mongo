var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Operator extends Model {

}

return




const operator = new Operator('operator')

operator.setData({

})

describe('Testing crud module operator ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create operator model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                operator.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get operator model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          operator.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit operator model', function(done){

          operator.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete operator model', function(done){

          operator.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all operator', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          operator.get(function(err , data){
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

module.exports = Operator
