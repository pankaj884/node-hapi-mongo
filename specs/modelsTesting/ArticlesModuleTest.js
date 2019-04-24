var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Articles extends Model {

}

return




const articles = new Articles('articles')

articles.setData({

})

describe('Testing crud module articles ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create articles model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                articles.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get articles model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          articles.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit articles model', function(done){

          articles.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete articles model', function(done){

          articles.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all articles', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          articles.get(function(err , data){
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

module.exports = Articles
