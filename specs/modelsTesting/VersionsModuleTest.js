var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Versions extends Model {

}

return




const versions = new Versions('versions')

versions.setData({

})

describe('Testing crud module versions ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create versions model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                versions.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get versions model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          versions.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit versions model', function(done){

          versions.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete versions model', function(done){

          versions.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all versions', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          versions.get(function(err , data){
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

module.exports = Versions
