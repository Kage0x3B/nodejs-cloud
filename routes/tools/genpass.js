var bcrypt = require('bcrypt');
//first is cleartext 2nd is Salt
console.log(process.argv[2],process.argv[3]);
console.log(bcrypt.hashSync(process.argv[2], process.argv[3]));
