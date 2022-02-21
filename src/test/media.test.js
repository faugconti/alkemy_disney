const chai = require("chai");
const chaiHttp = require("chai-http");
require("dotenv").config();

chai.use(chaiHttp);
chai.should();

let id;
let requester;
let token;

const mediaEndpoint = "/movies";
const newMovie = {
  title: "Obi Wan Kenobi",
  created: "2022/03/15",
  genreId: 1,
  rating: 5,
  type: "SHOW",
  image: "https://e.rpp-noticias.io/normal/2022/02/09/341134_1215045.jpg",
};

describe("[API] Media endpoint", () => {
  before((done) => {
    requester = chai
      .request(`http://localhost:${process.env.PORT}/api`)
      .keepOpen();
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

  describe("[POST] /movies", () => {
    it("should NOT allow to create a new movie/show (unauthorized)", (done) => {
      requester.post(mediaEndpoint).end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it("should allow to create a new movie/show in the database", (done) => {
      requester
        .post(mediaEndpoint)
        .set("authorization", token)
        .set("content-type", "application/json")
        .send(newMovie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("should NOT process the request (invalid inputs)", (done) => {
      requester
        .post(mediaEndpoint)
        .set("authorization", token)
        .set("content-type", "application/json")
        .send({ title: "" })
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  describe("[GET] /movies", () => {
    it("should return all movies/shows stored in database", (done) => {
      requester.get(mediaEndpoint).end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.greaterThan(0);
        res.body[0].should.have.property("title");
        res.body[0].should.have.property("image");
        id = res.body.find((value) => value.title === newMovie["title"]).id;
        done();
      });
    });
    it("should search by query parameter title", (done) => {
      requester
        .get(mediaEndpoint + "/?title=" + newMovie["title"])
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("image");
          done();
        });
    });
    it("should search by query parameter genreId", (done) => {
      requester
        .get(mediaEndpoint + "/?genre=" + newMovie["genreId"])
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("image");
          done();
        });
    });
    it("should not return a movie (invalid genre)", (done) => {
      requester.get(mediaEndpoint + "/?genre=6000").end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
    it("should not return a movie (invalid genre)", (done) => {
      requester.get(mediaEndpoint + "/?title=invalid").end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
  describe("[GET] /movies/{:id}", () => {
    it("should NOT process the request (invalid inputs)", (done) => {
      requester
        .get(mediaEndpoint + "/abcd")
        .set("content-type", "application/json")
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it("should NOT process the request (invalid id)", (done) => {
      requester
        .get(mediaEndpoint + "/5000")
        .set("content-type", "application/json")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it("should allow to fetch a movie/show", (done) => {
      requester
        .get(mediaEndpoint + "/" + id)
        .set("content-type", "application/json")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("image");
          res.body.should.have.property("rating");
          res.body.should.have.property("id");
          res.body.should.have.property("created");
          res.body.should.have.property("genreId");
          done();
        });
    });
  });
  describe("[PATCH] /movies/:id", () => {
    it("should NOT update a movie/show (invalid inputs)", (done) => {
      requester
        .patch(`${mediaEndpoint}/${0}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it("should NOT update a movie/show (invalid id)", (done) => {
      requester
        .patch(`${mediaEndpoint}/${6000}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it("should NOT update a movie/show (unauthorized)", (done) => {
      requester.patch(`${mediaEndpoint}/${id}`).end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it("should update a movie/show", (done) => {
      requester
        .patch(`${mediaEndpoint}/${id}`)
        .set("authorization", token)
        .set("content-type", "application/json")
        .send({ ...newMovie, type: "SHOW" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe("[DELETE] /movies/:id", () => {
    it("should delete a movie/show stored in database", (done) => {
      requester
        .delete(`${mediaEndpoint}/${id}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("should NOT delete a movie/show (invalid inputs)", (done) => {
      requester
        .delete(`${mediaEndpoint}/${0}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it("should NOT delete a movie/show (unauthorized)", (done) => {
      requester.delete(`${mediaEndpoint}/${id}`).end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it("should NOT delete a movie/show (not existant)", (done) => {
      requester
        .delete(`${mediaEndpoint}/${50000}`)
        .set("authorization", token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
