import { CreateKudosCategory } from '../../../../../src/application/useCases/category/CreateKudosCategory';
import { IKudosCategoryRepository } from '../../../../../src/domain/interfaces/repositories/KudosCategoryRepository';
import { KudosCategory } from '../../../../../src/domain/entities/KudosCategory';
import { CreateKudosCategoryDTO, KudosCategoryDTO } from '../../../../../src/dtos/KudosCategoryDto';
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
};

// Mock category data
const mockCategoryProps = {
  id: 'category-123',
  name: 'Leadership',
  description: 'For demonstrating leadership skills',
  icon: 'trophy',
  color: '#FFC107',
  isActive: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockCategory = KudosCategory.create(mockCategoryProps);

// Mock category DTO
const mockCategoryDTO: KudosCategoryDTO = {
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

// Test CreateKudosCategory use case
describe('CreateKudosCategory Use Case', () => {
  let createKudosCategory: CreateKudosCategory;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    createKudosCategory = new CreateKudosCategory(mockKudosCategoryRepository);
    
    // Mock the KudosCategoryMapper.toDTO method
    jest.spyOn(KudosCategoryMapper, 'toDTO').mockReturnValue(mockCategoryDTO);
  });
  
  it('should successfully create a category with valid data', async () => {
    // Arrange
    const createCategoryDto: CreateKudosCategoryDTO = {
      name: 'Leadership',
      description: 'For demonstrating leadership skills',
      icon: 'trophy',
      color: '#FFC107'
    };
    
    // Mock repository responses
    mockKudosCategoryRepository.getCategoryByName.mockResolvedValue(null);
    mockKudosCategoryRepository.createCategory.mockResolvedValue(mockCategory);
    
    // Act
    const result = await createKudosCategory.execute(createCategoryDto);
    
    // Assert
    expect(mockKudosCategoryRepository.getCategoryByName).toHaveBeenCalledWith(createCategoryDto.name);
    expect(mockKudosCategoryRepository.createCategory).toHaveBeenCalledWith(createCategoryDto);
    expect(KudosCategoryMapper.toDTO).toHaveBeenCalledWith(mockCategory);
    expect(result).toEqual(
      ResponseMapper.success(
        mockCategoryDTO,
        'Category created successfully'
      )
    );
  });
  
  it('should return validation error when category with same name already exists', async () => {
    // Arrange
    const createCategoryDto: CreateKudosCategoryDTO = {
      name: 'Leadership',
      description: 'For demonstrating leadership skills',
      icon: 'trophy',
      color: '#FFC107'
    };
    
    // Mock repository responses
    mockKudosCategoryRepository.getCategoryByName.mockResolvedValue(mockCategory);
    
    // Act
    const result = await createKudosCategory.execute(createCategoryDto);
    
    // Assert
    expect(mockKudosCategoryRepository.getCategoryByName).toHaveBeenCalledWith(createCategoryDto.name);
    expect(mockKudosCategoryRepository.createCategory).not.toHaveBeenCalled();
    expect(KudosCategoryMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.validationError(`Category with name "${createCategoryDto.name}" already exists`)
    );
  });
  
  it('should return server error when category creation fails', async () => {
    // Arrange
    const createCategoryDto: CreateKudosCategoryDTO = {
      name: 'Leadership',
      description: 'For demonstrating leadership skills',
      icon: 'trophy',
      color: '#FFC107'
    };
    
    // Mock repository responses
    mockKudosCategoryRepository.getCategoryByName.mockResolvedValue(null);
    mockKudosCategoryRepository.createCategory.mockResolvedValue(null);
    
    // Act
    const result = await createKudosCategory.execute(createCategoryDto);
    
    // Assert
    expect(mockKudosCategoryRepository.getCategoryByName).toHaveBeenCalledWith(createCategoryDto.name);
    expect(mockKudosCategoryRepository.createCategory).toHaveBeenCalledWith(createCategoryDto);
    expect(KudosCategoryMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.serverError(new Error('Failed to create category'))
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const createCategoryDto: CreateKudosCategoryDTO = {
      name: 'Leadership',
      description: 'For demonstrating leadership skills',
      icon: 'trophy',
      color: '#FFC107'
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockKudosCategoryRepository.getCategoryByName.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await createKudosCategory.execute(createCategoryDto);
    
    // Assert
    expect(mockKudosCategoryRepository.getCategoryByName).toHaveBeenCalledWith(createCategoryDto.name);
    expect(mockKudosCategoryRepository.createCategory).not.toHaveBeenCalled();
    expect(KudosCategoryMapper.toDTO).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 