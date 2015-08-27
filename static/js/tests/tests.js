describe("fixtures", function () {

    it('getLevelsByDifficulty', function () {
        expect(fixtures.getLevelsByDifficulty('easy').length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.EASY).length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.MEDIUM).length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.HARD).length).toBeGreaterThan(0);
        expect(fixtures.getLevelsByDifficulty(fixtures.EXPERT).length).toBeGreaterThan(0);
    });

    it('gets Levels', function () {
        expect(fixtures.getLevelById(1).id).toBe(1);
        expect(fixtures.getLevelById(20).id).toBe(20);
        expect(fixtures.getLevelById(40).id).toBe(40);
        expect(fixtures.getLevelIdx(40)).toBe(40 - 16 - 16);

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
    beforeEach(function () {
        jasmine.clock().install();
    });
    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('lets you navigate around', function (done) {
        APP.goto('/');
        APP.goto('/versus');
        APP.goto('/versus/1player');
        APP.goto('/versus/2player');
        APP.goto('/campaign');
        APP.goto('/campaign/easy');
        APP.goto('/campaign/easy/1');
        jasmine.clock().tick(999999); // shows the popup

        APP.game.board.getTile(0, 0).click();
        APP.game.board.getTile(3, 3).click();

        done();
    });
    it('THEN you clock the game!', function (done) {
        var level = fixtures.EXPERT_LEVELS[fixtures.EXPERT_LEVELS.length - 1];
        APP.gotoLevel(level);
        jasmine.clock().tick(999999);

        APP.game.starBar.setScore(9999999999999);
        APP.game.endHandler.setMoves(0);

        var isNextButtonVisible = $('#mm-next-level').is(':visible');
        expect(isNextButtonVisible).toBe(false);
        gameon.getUser(function (user) {
            user.saveDifficultiesUnlocked(9)
        });
        done();
    });

    it('tears down', function () {
        APP.goto('/tests');
    });
});
