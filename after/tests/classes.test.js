const request = require("supertest");
const app = require("../app");

describe("POST /klasy/", () => {
    test("Create Class", async () => {

        // First add judge.
        const newJudge = await request(app)
        .post("/sedziowie")
        .send({
            sedzia: "Jerzy Tymbark",
            kraj: "Polska"
        });

        const newClass = await request(app)
            .post("/klasy")
            .send({
                numer: 1,
                kat: 'klacze jednoroczne',
                czempionat: 1,
                komisja: [newJudge.body._id]
            });

        expect(newClass.statusCode).toBe(200);
    }, 30000);
});

describe("DELETE Class", () => {
    test("It responds with a message of Deleted", async () => {
        const newJudge = await request(app)
        .post("/sedziowie")
        .send({
            sedzia: "Jerzy Tymbark",
            kraj: "Polska"
        });

        const newClass = await request(app)
            .post("/klasy")
            .send({
                numer: 1,
                kat: 'klacze jednoroczne',
                czempionat: 1,
                komisja: [newJudge.body._id]
            });

        const removedClass = await request(app).delete(
            `/klasy/${newClass.body._id}`
        );

        expect(removedClass.statusCode).toBe(200);
    }, 30000);
});

describe("UPDATE /klasy/1", () => {
    test("It responds with an updated class", async () => {
        const newJudge = await request(app)
        .post("/sedziowie")
        .send({
            sedzia: "Jerzy Tymbark",
            kraj: "Polska"
        });
        
        const newClass = await request(app)
            .post("/klasy")
            .send({
                numer: 1,
                kat: 'klacze jednoroczne',
                czempionat: 1,
                komisja: [newJudge.body._id]
            });

        const updatedClass = await request(app)
            .put(`/klasy/${newClass.body._id}`)
            .send({
                numer: 2,
                kat: 'klacze jednoroczne',
                czempionat: 1,
                komisja: [newJudge.body._id]
            });

        expect(updatedClass.statusCode).toBe(200);
    }, 30000);
});