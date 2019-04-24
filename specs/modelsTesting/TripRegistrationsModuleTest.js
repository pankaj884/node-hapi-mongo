var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class TripRegistrations extends Model {

}

return




const tripRegistrations = new TripRegistrations('tripRegistrations')

tripRegistrations.setData({

})

describe('Testing crud module tripRegistrations ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create tripRegistrations model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                tripRegistrations.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get tripRegistrations model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tripRegistrations.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit tripRegistrations model', function(done){

          tripRegistrations.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete tripRegistrations model', function(done){

          tripRegistrations.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all tripRegistrations', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tripRegistrations.get(function(err , data){
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

module.exports = TripRegistrations
