const FAKER = require('faker');

module.exports = {

    /**
     * Function to return false data with a chance of 5%
     */
    randDataError(output) {
        const ERRORS = [undefined, null, '', {}];
        return FAKER.random.number({ min: 0, max: 100 }) > 5 ? output : FAKER.random.arrayElement(ERRORS);
    }

}