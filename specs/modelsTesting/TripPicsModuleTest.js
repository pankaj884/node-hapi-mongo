var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class TripPics extends Model {

}

return




const tripPics = new TripPics('tripPics')

tripPics.setData({

})

describe('Testing crud module tripPics ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create tripPics model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                tripPics.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get tripPics model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tripPics.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit tripPics model', function(done){

          tripPics.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete tripPics model', function(done){

          tripPics.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all tripPics', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tripPics.get(function(err , data){
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

module.exports = TripPics
