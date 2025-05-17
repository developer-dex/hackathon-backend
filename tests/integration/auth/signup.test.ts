import { request } from '../setup';
import { UserModel } from '../../../src/infrastructure/database/models/UserModel';
import { TeamModel } from '../../../src/infrastructure/database/models/TeamModel';
import { EUserRole, VerificationStatus } from '../../../src/domain/entities/User';
import mongoose from 'mongoose';

describe('Auth API - Signup', () => {
  let teamId: string;
  
  beforeEach(async () => {
    // Create a team for the user to join
    const team = await TeamModel.create({
      name: 'Test Team',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    teamId = team._id.toString();
  });
  
  it('should successfully register a new user with valid data', async () => {
    // Arrange
    const signupData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: EUserRole.TEAM_MEMBER,
      teamId: teamId
    };
    
    // Act
    const response = await request
      .post('/api/auth/signup')
      .send(signupData);
    
    // Assert
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('email', signupData.email);
    expect(response.body.data).toHaveProperty('name', signupData.name);
    
    // Check database
    const createdUser = await UserModel.findOne({ email: signupData.email });
    expect(createdUser).toBeTruthy();
    expect(createdUser?.name).toBe(signupData.name);
    expect(createdUser?.role).toBe(signupData.role);
    expect(createdUser?.teamId.toString()).toBe(signupData.teamId);
  });
  
  it('should return validation error when passwords do not match', async () => {
    // Arrange
    const signupData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
      role: EUserRole.TEAM_MEMBER,
      teamId: teamId
    };
    
    // Act
    const response = await request
      .post('/api/auth/signup')
      .send(signupData);
    
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch("Validation failed");
    
    // Verify user wasn't created
    const user = await UserModel.findOne({ email: signupData.email });
    expect(user).toBeNull();
  });
  
  it('should return validation error when email is invalid', async () => {
    // Arrange
    const signupData = {
      name: 'New User',
      email: 'invalid-email',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: EUserRole.TEAM_MEMBER,
      teamId: teamId
    };
    
    // Act
    const response = await request
      .post('/api/auth/signup')
      .send(signupData);
    
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  
  it('should return error when team ID does not exist', async () => {
    // Arrange
    const signupData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: EUserRole.TEAM_MEMBER,
      teamId: new mongoose.Types.ObjectId().toString() // Non-existent team ID
    };
    
    // Act
    const response = await request
      .post('/api/auth/signup')
      .send(signupData);
    
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/team not found/i);
  });
  
  it('should return conflict error when email already exists', async () => {
    // Arrange - Create a user first
    await UserModel.create({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'hashedpassword',
      role: EUserRole.TEAM_MEMBER,
      teamId: new mongoose.Types.ObjectId(teamId),
      verificationStatus: VerificationStatus.VERIFIED,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const signupData = {
      name: 'New User',
      email: 'existing@example.com', // Same email as existing user
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: EUserRole.TEAM_MEMBER,
      teamId: teamId
    };
    
    // Act
    const response = await request
      .post('/api/auth/signup')
      .send(signupData);
    
    // Assert
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch("Validation failed");
  });
  
  it('should return validation error when required fields are missing', async () => {
    // Arrange - Missing name
    const signupData = {
      email: 'newuser@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: EUserRole.TEAM_MEMBER,
      teamId: teamId
    };
    
    // Act
    const response = await request
      .post('/api/auth/signup')
      .send(signupData);
    
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
}); 