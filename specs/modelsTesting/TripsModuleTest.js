var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Trips extends Model {

}

return




const trips = new Trips('trips')

trips.setData({

})

describe('Testing crud module trips ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create trips model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                trips.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get trips model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          trips.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit trips model', function(done){

          trips.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete trips model', function(done){

          trips.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all trips', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          trips.get(function(err , data){
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

module.exports = Trips
