var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Testing extends Model {

}

return




const testing = new Testing('testing')

testing.setData({

})

describe('Testing crud module testing ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create testing model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                testing.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get testing model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          testing.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit testing model', function(done){

          testing.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete testing model', function(done){

          testing.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all testing', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          testing.get(function(err , data){
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

module.exports = Testing
