const request = require("supertest");
const app = require("../app");

describe("POST /sedziowie/", () => {
    test("Create Judge", async () => {
        const newJudge = await request(app)
            .post("/sedziowie")
            .send({
                sedzia: "Jerzy Tymbark",
                kraj: "Polska"
            });

        expect(newJudge.statusCode).toBe(200);
    }, 30000);
});

describe("DELETE Judge", () => {
    test("It responds with a message of Deleted", async () => {
        const newJudge = await request(app)
            .post("/sedziowie")
            .send({
                sedzia: "Khasjan Yksahek",
                kraj: "Wenezuela"
            });

        const removedJudge = await request(app).delete(
            `/sedziowie/${newJudge.body._id}`
        );
        expect(removedJudge.body).toEqual({
            message: "Judge deleted successfully"
        });
        expect(removedJudge.statusCode).toBe(202);
    }, 30000);
});

describe("UPDATE Judge", () => {
    test("It responds with an updated judge", async () => {
        const newJudge = await request(app)
            .post("/sedziowie")
            .send({
                sedzia: "Khasjan Yksahek",
                kraj: "Wenezuela"
            });

        const updatedJudge = await request(app)
            .put(`/sedziowie/${newJudge.body._id}`)
            .send({
                sedzia: "Khasjan Yksahek",
                kraj: "Kazachstan"
            });

        expect(updatedJudge.statusCode).toBe(200);
    }, 30000);
});