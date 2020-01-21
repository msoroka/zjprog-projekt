var Judges = require('../app/http/controllers/judges.controller');

module.exports = function (router) {
    router.post('/sedziowie', Judges.createJudge);
    router.get('/sedziowie', Judges.getJudges);
    router.get('/sedziowie/:id', Judges.getJudge);
    router.put('/sedziowie/:id', Judges.updateJudge);
    router.delete('/sedziowie/:id', Judges.removeJudge);
};
