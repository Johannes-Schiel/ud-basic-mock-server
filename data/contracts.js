const FAKER = require('faker');
const CORE = require('./../helper/core-functions');

/**
 * Function to generate Features
 */
function generateFeatures(count) {
    const keypoints = [];
    for (let i = 0; i < count; i++) {
        keypoints.push(
            FAKER.random.boolean() ? CORE.randDataError(FAKER.lorem.word()) : CORE.randDataError(FAKER.lorem.paragraph())
        );
    }
    return keypoints;
}

module.exports = {

    /**
     * Function to generate Users with a set DTO.
     */
    generateContracts(count) {
        const CONTACTS = [];
        // Generate Random Contracts
        for (var i = 1; i <= count; i++) {
            CONTACTS.push({
                id: FAKER.random.uuid(),
                features: generateFeatures(FAKER.random.number({ min: 0, max: 5 })),
                status: CORE.randDataError(FAKER.random.arrayElement(['active', 'pending', 'inactive'])),
                contractNumber: CORE.randDataError(`HH00-${FAKER.random.uuid()}`),
                label: CORE.randDataError(FAKER.lorem.word()),
                description: CORE.randDataError(FAKER.lorem.paragraph()),
                thumbnail: CORE.randDataError(FAKER.image.abstract()),
                price: {
                    sum: CORE.randDataError(FAKER.random.number({ min: 5, max: 100 })),
                    period: CORE.randDataError(FAKER.random.arrayElement([`month`, `year`, `quarter`]))
                },
            });
        }
        return CONTACTS;
    }

};