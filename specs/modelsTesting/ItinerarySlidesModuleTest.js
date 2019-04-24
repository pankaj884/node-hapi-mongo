var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class ItinerarySlides extends Model {

}

return




const itinerarySlides = new ItinerarySlides('itinerarySlides')

itinerarySlides.setData({

})

describe('Testing crud module itinerarySlides ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create itinerarySlides model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                itinerarySlides.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get itinerarySlides model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          itinerarySlides.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit itinerarySlides model', function(done){

          itinerarySlides.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete itinerarySlides model', function(done){

          itinerarySlides.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all itinerarySlides', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          itinerarySlides.get(function(err , data){
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

module.exports = ItinerarySlides
