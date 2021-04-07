/**
 * In this file everything is handled wich has to do with the random
 * generation of the db.json. So when there have to be more datatypes oder  entry points you
 * simply can add more random data here.
 */

const FS = require('fs');
const USERS = require('./data/users');
const CONTACTS = require('./data/contracts');

/**
 * Define the final Database with all informaiton of the mocked backend
 */
const DATABASE = {
    users: [],
    contracts: []
};

// #############################################
// Generate random Date for the ContractsDTO
DATABASE.contracts = CONTACTS.generateContracts(15);
JSON.parse(FS.readFileSync('./errors/contracts.json')).forEach(contract => {
    DATABASE.contracts.push(contract);
});
console.log(`done .... ${DATABASE.contracts.length} contracts added`);

// #############################################
// Generate random Date for the UsersDTO
DATABASE.users = USERS.generateUsers(5, DATABASE.contracts);
JSON.parse(FS.readFileSync('./errors/users.json')).forEach(user => {
    DATABASE.users.push(user);
});
console.log(`done .... ${DATABASE.users.length} users added`);

// Write everything thats included in the DATABASE Objekt to the console
// and pase this with nodeJS to db.json
FS.writeFile('./db.json', JSON.stringify(DATABASE), (err) => {
    if (err) console.log(err);
});

