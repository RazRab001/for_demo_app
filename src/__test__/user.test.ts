import request from "supertest";
import app from "../index";
import mongoose from "mongoose";

const login = "superpuper";
const email = `${login}@gmail.com`;
const password = "Giejne44$";
let tokens: any;

afterAll(() => {
  mongoose.connection.close();
});

describe("user registration", () => {
  it("return 201 status if created new unique user", async () => {
    await request(app)
      .post("/user/auth")
      .send({ login: login, email: email, password: password })
      .expect(201);

    await request(app).get(`/user/${login}`).expect(200);
  });
});

describe("loging", () => {
  it("return 400 if user with this login already exist", async () => {
    await request(app)
      .post("/user/auth")
      .send({ login: "otherlogin", email: email, password: password })
      .expect(400);
  });

  it("return 400 if user with this email already exist", async () => {
    await request(app)
      .post("/user/auth")
      .send({ login: login, email: "othermail@gmail.com", password: password })
      .expect(400);
  });

  it("return 200 if user success login", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: email, password: password })
      .expect(200);

    tokens = res.body.tokens;
  });
});

describe("Authorization middleware", () => {
  beforeEach(async () => {
    // Ensure tokens are obtained before each test in this block
    const res = await request(app)
      .post("/user/login")
      .send({ email: email, password: password })
      .expect(200);

    tokens = res.body.tokens;
  });

  it("should return 404 if Authorization header is not found", async () => {
    await request(app)
      .get("/user")
      .expect(404)
      .expect({ message: "Authorization header not found" });
  });

  it("should return 404 if Refresh token found, but user id not found", async () => {
    await request(app)
      .get("/user")
      .set("Cookie", [`refreshToken=${tokens.refresh_token}`])
      .expect(404)
      .expect({ message: "Refresh token found, but user id not found" });
  });

  it("should return 404 if Refresh token found, user id found, but user not found", async () => {
    await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${tokens.access_token}`)
      .set("Cookie", [`refreshToken=${tokens.refresh_token}`])
      .expect(404)
      .expect({
        message: "Refresh token found, but user id found, but user not found"
      });
  });
});

describe("delete user", () => {
  it("return 204 if user success delete", async () => {
    await request(app).delete(`/user/${login}`).expect(204);
  });
});
