import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, VerificationStatus } from '../../domain/entities/User';
import { UserDTO } from '../../dtos/AuthDto';
import { UserModel, UserDocument } from '../database/models/UserModel';
import { UserMapper } from '../../mappers/UserMapper';
import { SignupRequestDto } from '../../dtos/AuthDto';
import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export class UserRepositoryImpl implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id);
      if (!user) return null;
      
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(providedPassword, storedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  generateToken(user: UserDTO): string {
    const payload = UserMapper.toTokenPayload(user);
    
    return jwt.sign(
      payload, 
      JWT_SECRET as Secret, 
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );
  }

  verifyToken(token: string): Promise<UserDTO | null> {
    return new Promise((resolve) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET as Secret) as jwt.JwtPayload;
        
        if (!decoded || !decoded.sub) {
          resolve(null);
          return;
        }

        // Find user by ID to get the latest user data
        UserModel.findById(decoded.sub)
          .then(user => {
            const userDTO = UserMapper.documentToDTO(user);
            resolve(userDTO);
          })
          .catch(err => {
            console.error('Error finding user by ID:', err);
            resolve(null);
          });
      } catch (error) {
        console.error('Error verifying token:', error);
        resolve(null);
      }
    });
  }

  async createUser(userData: SignupRequestDto): Promise<User | null> {
    try {
      // Create the new user with verification status as PENDING
      const newUser = new UserModel({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        teamId: userData.teamId,
        verificationStatus: VerificationStatus.PENDING
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      
      // Convert to domain entity and return
      return UserMapper.toDomain(savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async getAllUsers(role?: string, limit?: number, offset: number = 0): Promise<User[]> {
    try {
      const query = role ? { role } : {};
      
      let dbQuery = UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(offset);

      if (limit) {
        dbQuery = dbQuery.limit(limit);
      }
      
      const users = await dbQuery.exec();
      
      return users
        .map(user => UserMapper.toDomain(user))
        .filter((user): user is User => user !== null);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getTotalUsersCount(role?: string): Promise<number> {
    try {
      const query = role ? { role } : {};
      return await UserModel.countDocuments(query);
    } catch (error) {
      console.error('Error getting total users count:', error);
      return 0;
    }
  }

  async updateVerificationStatus(userId: string, status: VerificationStatus): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { verificationStatus: status },
        { new: true } // Return the updated document
      );
      
      if (!updatedUser) {
        return null;
      }
      
      return UserMapper.toDomain(updatedUser);
    } catch (error) {
      console.error('Error updating user verification status:', error);
      return null;
    }
  }
} 