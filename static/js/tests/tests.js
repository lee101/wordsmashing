describe("fixtures", function () {

    it('getLevelsByDifficulty', function () {
        expect(fixtures.getLevelsByDifficulty('easy').length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.EASY).length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.MEDIUM).length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.HARD).length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.EXPERT).length).toBeGreaterThan(0);
    });
    it('other stuff', function () {
        var numEasyLevels = fixtures.EASY_LEVELS.length;
        var numMediumLevels = fixtures.MEDIUM_LEVELS.length;
        var numHardLevels = fixtures.HARD_LEVELS.length;
        var numExpertLevels = fixtures.EXPERT_LEVELS.length;
        expect(fixtures.LEVELS.length).toBe(numExpertLevels + numEasyLevels + numMediumLevels + numHardLevels);
    });

});
describe("WordSmashing", function () {

    it('level 1', function () {
        APP.goto('/');
        APP.goto('/campaign');
        APP.goto('/campaign/easy');
        APP.goto('/campaign/easy/1');
    });


    it('go back to /tests', function () {
        APP.goto('/tests');
    });
});
