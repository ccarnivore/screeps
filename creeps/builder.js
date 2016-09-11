var c = require('main.const');

var Builder = {};
Builder.prototype.sayHello = function() {
    console.log('hello');
}

module.exports = Builder;