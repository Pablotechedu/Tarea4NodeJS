// Pruebas básicas de tareas - CRUD
import request from "supertest";
import { initializeApp } from "../../app.js";

describe("Tasks CRUD Tests", () => {
  let app;
  let authToken;

  beforeAll(async () => {
    app = await initializeApp();
  });

  beforeEach(async () => {
    // Crear usuario y obtener token para cada prueba
    const userData = {
      username: "taskuser",
      email: "task@example.com",
      password: "Task123456",
      firstName: "Task",
      lastName: "User",
    };

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    authToken = registerResponse.body.data.token;
  });

  // PRUEBA 4: Crear tarea con datos válidos (POST válido)
  test("should create task with valid data", async () => {
    const taskData = {
      title: "Mi primera tarea",
      description: "Esta es una tarea de prueba",
      priority: "high",
    };

    const response = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send(taskData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.task.title).toBe(taskData.title);
    expect(response.body.data.task.completed).toBe(false);
  });

  // PRUEBA 5: Fallar creación con datos inválidos (POST inválido)
  test("should fail to create task with invalid data", async () => {
    const invalidTaskData = {
      title: "", // Título vacío
      priority: "invalid", // Prioridad inválida
    };

    const response = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send(invalidTaskData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });

  // PRUEBA 6: Obtener todas las tareas (GET)
  test("should get all user tasks", async () => {
    // Crear una tarea primero
    await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Tarea para obtener" });

    const response = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.tasks).toBeDefined();
    expect(response.body.data.tasks.length).toBeGreaterThan(0);
  });

  // PRUEBA 7: Actualizar tarea (PUT)
  test("should update task successfully", async () => {
    // Crear una tarea
    const createResponse = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Tarea original" });

    const taskId = createResponse.body.data.task.id;

    // Actualizar la tarea
    const updateData = {
      title: "Tarea actualizada",
      completed: true,
    };

    const response = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.task.title).toBe(updateData.title);
    expect(response.body.data.task.completed).toBe(true);
  });

  // PRUEBA 8: Eliminar tarea (DELETE)
  test("should delete task successfully", async () => {
    // Crear una tarea
    const createResponse = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Tarea para eliminar" });

    const taskId = createResponse.body.data.task.id;

    // Eliminar la tarea
    const response = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.deletedTaskId).toBe(taskId);
  });
});
