import { GetAllKudosCategories } from '../../../../../src/application/useCases/category/GetAllKudosCategories';
import { IKudosCategoryRepository } from '../../../../../src/domain/interfaces/repositories/KudosCategoryRepository';
import { KudosCategory } from '../../../../../src/domain/entities/KudosCategory';
import { KudosCategoryDTO } from '../../../../../src/dtos/KudosCategoryDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { KudosCategoryMapper } from '../../../../../src/mappers/KudosCategoryMapper';

// Mock the FileUploadService
jest.mock('../../../../../src/infrastructure/services/FileUploadService', () => ({
  getIconUrl: jest.fn(() => 'mocked-url')
}));

// Mock dependencies
const mockKudosCategoryRepository: jest.Mocked<IKudosCategoryRepository> = {
  createCategory: jest.fn(),
  getCategoryById: jest.fn(),
  getCategoryByName: jest.fn(),
  getAllCategories: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  initializeDefaultCategories: jest.fn()
};

// Mock category data
const mockCategory1Props = {
  id: 'category-123',
  name: 'Leadership',
  description: 'For demonstrating leadership skills',
  icon: 'trophy',
  color: '#FFC107',
  isActive: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockCategory2Props = {
  id: 'category-456',
  name: 'Teamwork',
  description: 'For demonstrating excellent teamwork',
  icon: 'users',
  color: '#4CAF50',
  isActive: true,
  createdAt: '2023-01-02T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

const mockCategory1 = KudosCategory.create(mockCategory1Props);
const mockCategory2 = KudosCategory.create(mockCategory2Props);

// Mock category DTOs
const mockCategory1DTO: KudosCategoryDTO = {
  id: 'category-123',
  name: 'Leadership',
  description: 'For demonstrating leadership skills',
  icon: 'trophy',
  iconUrl: 'trophy',
  color: '#FFC107',
  isActive: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockCategory2DTO: KudosCategoryDTO = {
  id: 'category-456',
  name: 'Teamwork',
  description: 'For demonstrating excellent teamwork',
  icon: 'users',
  iconUrl: 'users',
  color: '#4CAF50',
  isActive: true,
  createdAt: '2023-01-02T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

// Test GetAllKudosCategories use case
describe('GetAllKudosCategories Use Case', () => {
  let getAllKudosCategories: GetAllKudosCategories;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    getAllKudosCategories = new GetAllKudosCategories(mockKudosCategoryRepository);
    
    // Mock the KudosCategoryMapper.toDTO method
    jest.spyOn(KudosCategoryMapper, 'toDTO')
      .mockImplementation((category) => {
        if (category.getId() === mockCategory1.getId()) {
          return mockCategory1DTO;
        } else if (category.getId() === mockCategory2.getId()) {
          return mockCategory2DTO;
        }
        return {} as KudosCategoryDTO;
      });
  });
  
  it('should successfully retrieve all categories', async () => {
    // Arrange
    const mockCategories = [mockCategory1, mockCategory2];
    const mockCategoryDTOs = [mockCategory1DTO, mockCategory2DTO];
    
    // Mock repository responses
    mockKudosCategoryRepository.getAllCategories.mockResolvedValue(mockCategories);
    
    // Act
    const result = await getAllKudosCategories.execute();
    
    // Assert
    expect(mockKudosCategoryRepository.getAllCategories).toHaveBeenCalled();
    expect(KudosCategoryMapper.toDTO).toHaveBeenCalledTimes(2);
    expect(result).toEqual(
      ResponseMapper.success(
        mockCategoryDTOs,
        'Categories retrieved successfully'
      )
    );
  });
  
  it('should return empty array when no categories exist', async () => {
    // Arrange
    const emptyCategories: KudosCategory[] = [];
    
    // Mock repository responses
    mockKudosCategoryRepository.getAllCategories.mockResolvedValue(emptyCategories);
    
    // Act
    const result = await getAllKudosCategories.execute();
    
    // Assert
    expect(mockKudosCategoryRepository.getAllCategories).toHaveBeenCalled();
    expect(KudosCategoryMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.success(
        [],
        'Categories retrieved successfully'
      )
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockKudosCategoryRepository.getAllCategories.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await getAllKudosCategories.execute();
    
    // Assert
    expect(mockKudosCategoryRepository.getAllCategories).toHaveBeenCalled();
    expect(KudosCategoryMapper.toDTO).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 