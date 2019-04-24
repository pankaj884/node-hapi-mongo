var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class TripSlides extends Model {

}

return




const tripSlides = new TripSlides('tripSlides')

tripSlides.setData({

})

describe('Testing crud module tripSlides ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create tripSlides model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                tripSlides.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get tripSlides model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tripSlides.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit tripSlides model', function(done){

          tripSlides.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete tripSlides model', function(done){

          tripSlides.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all tripSlides', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tripSlides.get(function(err , data){
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

module.exports = TripSlides
