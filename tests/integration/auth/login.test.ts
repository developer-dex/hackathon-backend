import { request } from '../setup';
import bcrypt from 'bcryptjs';
import { EUserRole, VerificationStatus } from '../../../src/domain/entities/User';
import { UserModel } from '../../../src/infrastructure/database/models/UserModel';
import { TeamModel } from '../../../src/infrastructure/database/models/TeamModel';

describe('Auth API - Login Integration Tests', () => {
  let testTeamId: string;

  beforeAll(async () => {
    // Create a test team for user registration
    const team = await TeamModel.create({
      name: 'Test Team',
      description: 'A team created for testing auth integration'
    });
    testTeamId = team._id.toString();

    // Create a verified user for login tests
    const passwordHash = await bcrypt.hash('Password123', 10);
    
    await UserModel.create({
      name: 'Login Test User',
      email: 'test.login@example.com',
      password: passwordHash,
      role: EUserRole.TEAM_MEMBER,
      teamId: testTeamId,
      verificationStatus: VerificationStatus.VERIFIED
    });

    // Create an unverified user
    await UserModel.create({
      name: 'Unverified User',
      email: 'test.unverified@example.com',
      password: passwordHash,
      role: EUserRole.TEAM_MEMBER,
      teamId: testTeamId,
      verificationStatus: VerificationStatus.PENDING
    });
  });

  // No cleanup methods as they're handled by setup.ts
  afterAll(async () => {
    await UserModel.deleteMany({ email: 'test.login@example.com' });
    await UserModel.deleteMany({ email: 'test.unverified@example.com' });
    await TeamModel.deleteMany({ name: 'Test Team' });
  });

  it('should login successfully with valid credentials', async () => {
    const loginData = {
      email: 'gaurav@example.com',
      password: 'Test@123'
    };

    const response = await request
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('email', loginData.email);
  });

  it('should return 401 for invalid credentials', async () => {
    const invalidLoginData = {
      email: 'test.login@example.com',
      password: 'WrongPassword'
    };

    const response = await request
      .post('/api/auth/login')
      .send(invalidLoginData)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Not found');
    expect(response.body.error).toContain('User not found');
  });

  it('should return 401 for unverified users', async () => {
    const unverifiedLoginData = {
      email: 'test.unverified@example.com',
      password: 'Password123'
    };

    const response = await request
      .post('/api/auth/login')
      .send(unverifiedLoginData)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Not found');
    expect(response.body.error).toContain('User not found');
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentUserData = {
      email: 'nonexistent@example.com',
      password: 'Password123'
    };

    const response = await request
      .post('/api/auth/login')
      .send(nonExistentUserData)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Not found');
    expect(response.body.error).toContain('User not found');
  });

  it('should return 400 for invalid request format', async () => {
    const invalidFormatData = {
      // Missing email and password
    };

    const response = await request
      .post('/api/auth/login')
      .send(invalidFormatData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
  });
}); 