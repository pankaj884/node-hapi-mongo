var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class S3file extends Model {

}

return




const s3file = new S3file('s3file')

s3file.setData({

})

describe('Testing crud module s3file ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create s3file model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                s3file.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get s3file model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          s3file.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit s3file model', function(done){

          s3file.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete s3file model', function(done){

          s3file.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all s3file', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          s3file.get(function(err , data){
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

module.exports = S3file
