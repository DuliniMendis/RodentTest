require('shelljs/global');
var d3 = require("d3");

function say(word) {
  console.log(word);
}

function execute(someFunction, value) {
  someFunction(value);
}

execute(say, "Hello");

console.log(Object.keys(d3));
console.log(Object.keys(this));


//process.exit()
//.exit
