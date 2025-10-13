const { expect, assert } = require("chai");
const cohorts = require("../cohorts.json");
const request = require("supertest");

const app = require("../app.js");

describe("GET /api/cohorts", () => {
  it("Should show cohorts", async () => {
    const res = await request(app).get("/api/cohorts");

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(cohorts);
  });
});
