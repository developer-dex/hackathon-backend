import { request } from '../setup';
import mongoose from 'mongoose';
import { EUserRole } from '../../../src/domain/entities/User';
import { UserModel } from '../../../src/infrastructure/database/models/UserModel';

describe('Auth API - Signup Integration Tests', () => {
  let testTeamId: string;

  beforeAll(async () => {
    testTeamId = "60286739c762b78cce0edfe4";
  });

  // No cleanup methods as they're handled by setup.ts
  afterAll(async () => {
    await UserModel.deleteMany({ email: 'test.useremail@example.com' });
  });

  it('should register a new user successfully', async () => {
    const signupData = {
      name: 'Test User',
      email: 'test.useremail@example.com',
      password: 'Test@123',
      confirmPassword: 'Test@123',
      role: EUserRole.TEAM_MEMBER,
      teamId: testTeamId
    };

    const response = await request
      .post('/api/auth/signup')
      .send(signupData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('User registered successfully');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('email', signupData.email);
    expect(response.body.data).toHaveProperty('name', signupData.name);
    expect(response.body.data).toHaveProperty('role', signupData.role);
    expect(response.body.data.team).toHaveProperty('id', testTeamId);
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteData = {
      name: 'Incomplete User',
      email: 'incomplete@example.com',
      // Missing password and other required fields
    };

    const response = await request
      .post('/api/auth/signup')
      .send(incompleteData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
  });

  it('should return 400 if passwords do not match', async () => {
    const mismatchPasswordData = {
      name: 'Mismatch User',
      email: 'mismatch@example.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword',
      role: EUserRole.TEAM_MEMBER,
      teamId: testTeamId
    };

    const response = await request
      .post('/api/auth/signup')
      .send(mismatchPasswordData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Passwords must match');
  });

  it('should return 409 if email is already registered', async () => {
    // First, create a user
    const existingUserData = {
      name: 'Existing User',
      email: 'test.useremail@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: testTeamId
    };

    await request
      .post('/api/auth/signup')
      .send(existingUserData);

    // Try to register with the same email
    const response = await request
      .post('/api/auth/signup')
      .send(existingUserData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Email is already registered');
  });

  it('should return 400 if team does not exist', async () => {
    const invalidTeamData = {
      name: 'Invalid Team User',
      email: 'test.invalidteam@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: new mongoose.Types.ObjectId().toString() // Non-existent team ID
    };

    const response = await request
      .post('/api/auth/signup')
      .send(invalidTeamData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Selected team does not exist');
  });
}); 