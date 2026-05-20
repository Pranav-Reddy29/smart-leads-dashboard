import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;
let app: Awaited<typeof import("../src/app")>["default"];
let connectDB: Awaited<typeof import("../src/config/db")>["default"];

describe("Smart Leads API", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET =
      "test-secret-key-123456";
    process.env.CLIENT_URL =
      "http://localhost:5173";
    process.env.TOKEN_EXPIRES_IN = "7d";

    mongoServer =
      await MongoMemoryServer.create();
    process.env.MONGO_URI =
      mongoServer.getUri();

    connectDB = (await import("../src/config/db"))
      .default;
    app = (await import("../src/app")).default;

    await connectDB();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("creates a workspace admin on registration and returns bootstrap data", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin User",
        email: "admin@northwind.com",
        password: "password123",
        organizationName: "Northwind",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.role).toBe(
      "admin"
    );
    expect(
      response.body.data.organization.name
    ).toBe("Northwind");
  });

  it("supports tenant-scoped invitations and blocks cross-tenant lead access", async () => {
    const firstWorkspace =
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Workspace One",
          email: "owner1@example.com",
          password: "password123",
          organizationName: "Workspace One",
        });

    const secondWorkspace =
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Workspace Two",
          email: "owner2@example.com",
          password: "password123",
          organizationName: "Workspace Two",
        });

    const firstToken =
      firstWorkspace.body.data.token;
    const secondToken =
      secondWorkspace.body.data.token;

    const invitationResponse =
      await request(app)
        .post("/api/users/invite")
        .set(
          "Authorization",
          `Bearer ${firstToken}`
        )
        .send({
          email: "sales1@example.com",
          role: "sales",
        });

    expect(invitationResponse.status).toBe(201);
    expect(
      invitationResponse.body.data.inviteUrl
    ).toContain("/accept-invite/");

    const invitationToken =
      invitationResponse.body.data.inviteUrl
        .split("/")
        .pop();

    const acceptResponse =
      await request(app)
        .post("/api/auth/invitations/accept")
        .send({
          token: invitationToken,
          name: "Sales User",
          password: "password123",
        });

    expect(acceptResponse.status).toBe(201);
    expect(acceptResponse.body.data.user.role).toBe(
      "sales"
    );

    const leadResponse = await request(app)
      .post("/api/leads")
      .set(
        "Authorization",
        `Bearer ${firstToken}`
      )
      .send({
        name: "Tenant Lead",
        email: "lead@tenantone.com",
        status: "New",
        source: "Website",
      });

    expect(leadResponse.status).toBe(201);

    const crossTenantLeadResponse =
      await request(app)
        .get(
          `/api/leads/${leadResponse.body.data._id}`
        )
        .set(
          "Authorization",
          `Bearer ${secondToken}`
        );

    expect(crossTenantLeadResponse.status).toBe(
      404
    );
  });
});
