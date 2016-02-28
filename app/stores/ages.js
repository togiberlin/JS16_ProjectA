var Age = require(__appbase + 'models/age');

module.exports = {

    add: function (data, callback) {
        var age = new Age();

        // check if POST data matches Schema
        for (var key in data) {
            if (data.hasOwnProperty(key) && !Age.schema.paths.hasOwnProperty(key)) {
                callback(2,key);
                return;
            }
            else
            {
                age[key] = data[key];
            }
        }

        age.save(function(err) {
            if (err){
                callback(3,err);
            }
            else {
                callback(1,age);
            }
        });
    },

    get: function(data, callback) {
        // check if POST data matches Schema
        for (var key in data) {
            if (data.hasOwnProperty(key) && !Age.schema.paths.hasOwnProperty(key)) {
                callback(2,key);
                return;
            }
        }

        Age.find(data, function(err,obj)
        {
            if(obj.length == 0)
                callback(3,data);
            else
                callback(1, obj);
        });
    },

    getByName: function(name, callback) {
        this.get({'name':name},callback);
    },

    getById: function(id, callback) {
        this.get({'_id': id},callback);
    },

    getAll: function (callback) {
        Age.find(function (err, ages) {
            if (err)
                callback(false,err);
            else
                callback(true,ages);
        });
    },

    remove: function (id, callback) {
        Age.remove({_id: id}, function(err, resp) {
            // more than zero entries removed?
            if (resp.result.n > 0)
                callback(true);
            else
                callback(false);
        });

    },

    edit: function (id, data, callback) {
        // check if POST data matches Schema
        for (var key in data) {
            if (data.hasOwnProperty(key) && !Age.schema.paths.hasOwnProperty(key)) {
                callback(4,key);
                return;
            }
        }

        this.getById(id,function(success, age) {
            // Age exists
            if(success == 1) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        Age[key] = data[key];
                    }
                }
                Age.save(function(err) {
                    if (err){
                        callback(3,err);
                    }
                    else {
                        callback(1,Age);
                    }
                });
            }
            // Age is not existing
            else if (success == 3) {
                callback(2, id);
            }
            else {
                callback(false, age);
            }
        });
    },
};