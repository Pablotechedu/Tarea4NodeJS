// Pruebas básicas de autenticación
import request from "supertest";
import { initializeApp } from "../../app.js";

describe("Authentication Tests", () => {
  let app;

  beforeAll(async () => {
    app = await initializeApp();
  });

  // PRUEBA 1: Registro exitoso con datos válidos
  test("should register user with valid data", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "Test123456",
      firstName: "Test",
      lastName: "User",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.token).toBeDefined();
  });

  // PRUEBA 2: Registro fallido con datos inválidos
  test("should fail registration with invalid data", async () => {
    const invalidData = {
      username: "ab", // Muy corto
      email: "invalid-email", // Email inválido
      password: "123", // Muy corta
      firstName: "",
      lastName: "",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(invalidData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });

  // PRUEBA 3: Login exitoso
  test("should login with valid credentials", async () => {
    const userData = {
      username: "loginuser",
      email: "login@example.com",
      password: "Login123456",
      firstName: "Login",
      lastName: "User",
    };

    // Registrar usuario primero
    await request(app).post("/api/v1/auth/register").send(userData);

    // Hacer login
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
