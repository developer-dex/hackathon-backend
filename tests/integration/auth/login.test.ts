import { request } from '../setup';
import { UserModel } from '../../../src/infrastructure/database/models/UserModel';
import { TeamModel } from '../../../src/infrastructure/database/models/TeamModel';
import { EUserRole, VerificationStatus } from '../../../src/domain/entities/User';
import bcrypt from 'bcryptjs';

describe('Auth API - Login', () => {
  let userId: string;
  let teamId: string;
  
  beforeEach(async () => {
    // Create a team for the user
    const team = await TeamModel.create({
      name: 'Test Team',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    teamId = team._id.toString();
    
    // Create a verified user with hashed password
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await UserModel.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: EUserRole.TEAM_MEMBER,
      teamId: team._id,
      verificationStatus: VerificationStatus.VERIFIED,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    userId = user._id.toString();
  });
  
  it('should successfully log in with valid credentials', async () => {
    // Arrange
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!'
    };
    
    // Act
    const response = await request
      .post('/api/auth/login')
      .send(loginData);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user).toHaveProperty('email', loginData.email);
    expect(response.body.data.user).toHaveProperty('name', 'Test User');
    expect(response.body.data.user).toHaveProperty('role', EUserRole.TEAM_MEMBER);
  });
  
  it('should return unauthorized error when password is incorrect', async () => {
    // Arrange
    const loginData = {
      email: 'test@example.com',
      password: 'WrongPassword123!'
    };
    
    // Act
    const response = await request
      .post('/api/auth/login')
      .send(loginData);
    
    // Assert
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch("Unauthorized");
  });
  
  it('should return not found error when user does not exist', async () => {
    // Arrange
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'Password123!'
    };
    
    // Act
    const response = await request
      .post('/api/auth/login')
      .send(loginData);
    
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/User not found/i);
  });
  
  it('should return validation error when email format is invalid', async () => {
    // Arrange
    const loginData = {
      email: 'invalid-email',
      password: 'Password123!'
    };
    
    // Act
    const response = await request
      .post('/api/auth/login')
      .send(loginData);
    
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/validation/i);
  });
  
  it('should return validation error when email or password is missing', async () => {
    // Act - Missing email
    const response1 = await request
      .post('/api/auth/login')
      .send({ password: 'Password123!' });
    
    // Assert
    expect(response1.status).toBe(400);
    expect(response1.body.success).toBe(false);
    
    // Act - Missing password
    const response2 = await request
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });
    
    // Assert
    expect(response2.status).toBe(400);
    expect(response2.body.success).toBe(false);
  });
}); 