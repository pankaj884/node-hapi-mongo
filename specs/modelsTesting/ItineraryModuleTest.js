var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Itinerary extends Model {

}

return




const itinerary = new Itinerary('itinerary')

itinerary.setData({

})

describe('Testing crud module itinerary ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create itinerary model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                itinerary.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get itinerary model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          itinerary.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit itinerary model', function(done){

          itinerary.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete itinerary model', function(done){

          itinerary.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all itinerary', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          itinerary.get(function(err , data){
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

module.exports = Itinerary
