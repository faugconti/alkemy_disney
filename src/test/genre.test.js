const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

let requester;
let token;
let id;

const genreEndpoint = "/genre";
const newGenre = {
  name: "Documental",
};

describe("[API] Genre endpoint", () => {
  before((done) => {
    requester = chai.request("http://localhost:8080/api").keepOpen();
    requester
      .post("/auth/login")
      .set("content-type-", "application/json")
      .send({ email: "test@test.com", password: "123456" })
      .end((err, res) => {
        if (!err) {
          token = `BEARER ${res.body.token}`;
        } else {
          throw err;
        }
        done();
      });
  });

  describe("[POST] /genres", () => {
    it("should NOT allow to create a new genre (unauthorized)", (done) => {
      requester.post(genreEndpoint).end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it("should allow to create a new genre in the database", (done) => {
      requester
        .post(genreEndpoint)
        .set("authorization", token)
        .set("content-type", "application/json")
        .send(newGenre)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("should NOT allow to create a new genre in the database (duplicated genre)", (done) => {
      requester
        .post(genreEndpoint)
        .set("authorization", token)
        .set("content-type", "application/json")
        .send(newGenre)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("should NOT process the request (invalid inputs)", (done) => {
      requester
        .post(genreEndpoint)
        .set("authorization", token)
        .set("content-type", "application/json")
        .send({ name: "" })
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  describe("[GET] /genres", () => {
    it("should return all genres stored in database", (done) => {
      requester.get(genreEndpoint).end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.greaterThan(0);
        res.body[0].should.have.property("name");
        id = res.body.find((value) => value.name === newGenre["name"]).id;
        done();
      });
    });
  });
  describe("[DELETE] /genres/:id", () => {
    it("should NOT delete a genre (invalid inputs)", (done) => {
      requester
        .delete(`${genreEndpoint}/${0}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it("should delete a genre stored in database", (done) => {
      requester
        .delete(`${genreEndpoint}/${id}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("should NOT delete a genre (unauthorized)", (done) => {
      requester.delete(`${genreEndpoint}/${id}`).end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it("should NOT delete a genre (not existant)", (done) => {
      requester
        .delete(`${genreEndpoint}/${50000}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
