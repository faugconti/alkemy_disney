const chai = require("chai");
const chaiHttp = require("chai-http");
const { User } = require("../models");

chai.use(chaiHttp);
chai.should();

const requester = chai.request("http://localhost:8080/api").keepOpen();

// pre-stored in DB (seed)
const registeredUser = {
  email: "test@test.com",
  password: "123456",
};
const unregisteredUser = {
  email: "john@doe.com",
  password: "123456",
};
const invalidUser = {
  email: "s",
  password: 3,
};

const loginEndpoint = "/auth/login";
const registerEndpoint = "/auth/register";

describe("[API] Authorization endpoint", () => {
  describe("[POST] /auth/login", () => {
    it("should allow to login a user saved in database", (done) => {
      requester
        .post(loginEndpoint)
        .set("content-type", "application/json")
        .send(registeredUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("email").eq(registeredUser["email"]);
          res.body.should.have.property("token");
          done();
        });
    });
    it("should NOT allow an unregisted user to login", (done) => {
      requester
        .post(loginEndpoint)
        .set("content-type", "application/json")
        .send(unregisteredUser)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          res.body.should.not.have.property("token");
          done();
        });
    });
    it("should NOT process request (invalid data type parameters)", (done) => {
      requester
        .post(loginEndpoint)
        .set("content-type", "application/json")
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.should.not.have.property("token");
          done();
        });
    });
    it("should NOT process request (invalid route)", (done) => {
      requester.get(loginEndpoint).end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
  describe("[POST] /auth/register", () => {
    it("should allow to register a new user in the database", (done) => {
      requester
        .post(registerEndpoint)
        .set("content-type", "application/json")
        .send(unregisteredUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("email").eq(unregisteredUser["email"]);
          res.body.should.have.property("token").to.be.a("string");
          done();
        });
    });
    it("should NOT allow to register an already registered user in the database", (done) => {
      requester
        .post(registerEndpoint)
        .set("content-type", "application/json")
        .send(registeredUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.should.have.property("message").to.be.a("string");
          done();
        });
    });
    it("should NOT process request (invalid data type parameters)", (done) => {
      requester
        .post(registerEndpoint)
        .set("content-type", "application/json")
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.should.not.have.property("token");
          done();
        });
    });
    it("should NOT process request (invalid route)", (done) => {
      requester.get(registerEndpoint).end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });

  after(() => {
    requester.close();
    User.findOne({ where: { email: unregisteredUser["email"] } }).then((user) =>
      user ? user.destroy() : null
    );
  });
});
