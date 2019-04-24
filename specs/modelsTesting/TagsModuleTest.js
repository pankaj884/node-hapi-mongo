var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Tags extends Model {

}

return




const tags = new Tags('tags')

tags.setData({

})

describe('Testing crud module tags ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create tags model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                tags.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get tags model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tags.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit tags model', function(done){

          tags.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete tags model', function(done){

          tags.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all tags', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          tags.get(function(err , data){
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

module.exports = Tags
