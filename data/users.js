const FAKER = require('faker');
const CORE = require('./../helper/core-functions');

module.exports = {

    /**
     * Function to generate Users with a set DTO.
     */
    generateUsers(count, contracts) {
        const USERS = [];
        for (var i = 1; i <= count; i++) {
            USERS.push({
                id: FAKER.random.uuid(),
                insuranceNumber: `E-000${FAKER.random.uuid()}`,
                firstname: CORE.randDataError(FAKER.name.firstName()),
                lastname: CORE.randDataError(FAKER.name.lastName()),
                email: CORE.randDataError(FAKER.internet.email()),
                password: CORE.randDataError(FAKER.internet.password()),
                contracts: CORE.randDataError(FAKER.random.arrayElements(contracts, FAKER.random.number({ min: 0, max: 5 }))),
                profilImg: CORE.randDataError(FAKER.image.cats()),
                address: {
                    street: CORE.randDataError(FAKER.address.streetName()),
                    zip: CORE.randDataError(FAKER.address.zipCode()),
                    city: CORE.randDataError(FAKER.address.city())
                }
            });
        }
        return USERS;
    }

};