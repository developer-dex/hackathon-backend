import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, VerificationStatus } from '../../domain/entities/User';
import { UserDTO } from '../../dtos/AuthDto';
import { UserModel, UserDocument } from '../database/models/UserModel';
import { UserMapper } from '../../mappers/UserMapper';
import { SignupRequestDto } from '../../dtos/AuthDto';
import { IUserRepository } from '../../domain/interfaces/repositories/UserRepository';
import dotenv from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';
import { pagination } from '../../shared/utils/utils';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export class UserRepositoryImpl implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email, deletedAt: null });
      if (!user) return null;
      
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async findByIdWithoutDeleteUser(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(id), deletedAt: null });
      if (!user) return null;
      
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
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

  async getAllUsers(role?: string, limit?: number, page?: number): Promise<User[]> {
    try {
      // Build query to filter by role and exclude deleted users
      const query = { 
        ...(role ? { role } : {}),
        deletedAt: null 
      };
      console.log("limit", limit);
      console.log("page", page);
      // Calculate pagination using the utility function
      const { size, offset } = pagination(limit, page);
      console.log("size", size);
      console.log("offset", offset);
      
      // Build the base query
      let dbQuery = UserModel.find(query).populate('teamId');
      dbQuery = dbQuery.sort({ createdAt: -1 });

      // Apply pagination if parameters are provided
      if (offset !== undefined) {
        dbQuery = dbQuery.skip(offset);
      }

      if (size !== undefined) {
        dbQuery = dbQuery.limit(size);
      }
      
      // Execute the query
      const users = await dbQuery.exec();
      
      // Map database models to domain entities
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
      const query = { 
        ...(role ? { role } : {}),
        deletedAt: null 
      };
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

  async updatePassword(userId: string, newPassword: string): Promise<User | null> {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update the user's password
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );
      
      if (!updatedUser) {
        return null;
      }
      
      return UserMapper.toDomain(updatedUser);
    } catch (error) {
      console.error('Error updating user password:', error);
      return null;
    }
  }

  async updateUser(userId: string, userData: UserDTO): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        userData,
        { new: true }
      );
      
      if (!updatedUser) {
        return null;
      }
      
      return UserMapper.toDomain(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Toggle a user's active status (soft delete/restore)
   * @param userId The ID of the user to update
   * @param isActive Whether the user should be active (true) or inactive (false)
   * @returns The updated user or null if the operation failed
   */
  async toggleUserActiveStatus(userId: string, isActive: boolean): Promise<User | null> {
    try {
      const update = isActive 
        ? { deletedAt: null } // Remove the deletedAt field to activate the user
        : { deletedAt: new Date() }; // Set deletedAt to current date to deactivate
      
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        update,
        { new: true } // Return the updated document
      );
      
      if (!updatedUser) {
        return null;
      }
      
      return UserMapper.toDomain(updatedUser);
    } catch (error) {
      console.error(`Error ${isActive ? 'activating' : 'deactivating'} user:`, error);
      return null;
    }
  }

  async updateUserRole(userId: string, role: string): Promise<User | null> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: userId, deletedAt: null },
        { $set: { role } },
        { new: true }
      );
      
      if (!user) {
        return null;
      }
      
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  }
} 