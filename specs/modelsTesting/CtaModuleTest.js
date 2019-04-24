var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Cta extends Model {

}

return




const cta = new Cta('cta')

cta.setData({

})

describe('Testing crud module cta ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create cta model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                cta.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get cta model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          cta.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit cta model', function(done){

          cta.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete cta model', function(done){

          cta.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all cta', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          cta.get(function(err , data){
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

module.exports = Cta
