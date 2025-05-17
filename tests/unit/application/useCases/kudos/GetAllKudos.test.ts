import { GetAllKudos } from '../../../../../src/application/useCases/kudos/GetAllKudos';
import { IKudosRepository, KudosFilters } from '../../../../../src/domain/interfaces/repositories/KudosRepository';
import { KudosListItemDTO } from '../../../../../src/dtos/KudosDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';

// Mock dependencies
const mockKudosRepository: jest.Mocked<IKudosRepository> = {
  createKudos: jest.fn(),
  getKudosById: jest.fn(),
  getPopulatedKudos: jest.fn(),
  getKudosBySender: jest.fn(),
  getKudosByReceiver: jest.fn(),
  getAllKudos: jest.fn(),
  getAllKudosPopulated: jest.fn(),
  getTotalCount: jest.fn()
};

// Mock Kudos list items
const mockKudosListItems: KudosListItemDTO[] = [
  {
    id: 'kudos-123',
    sender: {
      id: 'team-lead-123',
      name: 'Team Lead',
      teamId: 'team-123'
    },
    receiver: {
      id: 'team-member-456',
      name: 'Team Member',
      teamId: 'team-123'
    },
    category: {
      id: 'category-123',
      name: 'Leadership',
      icon: 'trophy',
      color: '#FFC107'
    },
    team: {
      id: 'team-123',
      name: 'Engineering Team'
    },
    message: 'Great job leading the project!',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'kudos-456',
    sender: {
      id: 'team-lead-123',
      name: 'Team Lead',
      teamId: 'team-123'
    },
    receiver: {
      id: 'team-member-789',
      name: 'Another Team Member',
      teamId: 'team-123'
    },
    category: {
      id: 'category-456',
      name: 'Teamwork',
      icon: 'users',
      color: '#4CAF50'
    },
    team: {
      id: 'team-123',
      name: 'Engineering Team'
    },
    message: 'Excellent collaboration with the team!',
    createdAt: '2023-01-02T00:00:00.000Z'
  }
];

// Test GetAllKudos use case
describe('GetAllKudos Use Case', () => {
  let getAllKudos: GetAllKudos;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    getAllKudos = new GetAllKudos(mockKudosRepository);
  });
  
  it('should successfully retrieve all kudos without filters', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const total = 2;
    
    // Mock repository responses
    mockKudosRepository.getAllKudosPopulated.mockResolvedValue(mockKudosListItems);
    mockKudosRepository.getTotalCount.mockResolvedValue(total);
    
    // Act
    const result = await getAllKudos.execute(limit, offset);
    
    // Assert
    expect(mockKudosRepository.getAllKudosPopulated).toHaveBeenCalledWith(limit, offset, undefined);
    expect(mockKudosRepository.getTotalCount).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(
      ResponseMapper.success(
        mockKudosListItems,
        `Retrieved ${mockKudosListItems.length} kudos successfully`,
        { total, offset, limit }
      )
    );
  });
  
  it('should successfully retrieve filtered kudos with limit and offset', async () => {
    // Arrange
    const limit = 5;
    const offset = 5;
    const total = 10;
    const filters: KudosFilters = {
      teamId: 'team-123',
      categoryId: 'category-123'
    };
    
    // Mock repository responses
    mockKudosRepository.getAllKudosPopulated.mockResolvedValue([mockKudosListItems[0]]);
    mockKudosRepository.getTotalCount.mockResolvedValue(total);
    
    // Act
    const result = await getAllKudos.execute(limit, offset, filters);
    
    // Assert
    expect(mockKudosRepository.getAllKudosPopulated).toHaveBeenCalledWith(limit, offset, filters);
    expect(mockKudosRepository.getTotalCount).toHaveBeenCalledWith(filters);
    expect(result).toEqual(
      ResponseMapper.success(
        [mockKudosListItems[0]],
        `Retrieved 1 kudos successfully`,
        { total, offset, limit }
      )
    );
  });
  
  it('should successfully retrieve kudos when no limit or offset is provided', async () => {
    // Arrange
    const total = 2;
    
    // Mock repository responses
    mockKudosRepository.getAllKudosPopulated.mockResolvedValue(mockKudosListItems);
    mockKudosRepository.getTotalCount.mockResolvedValue(total);
    
    // Act
    const result = await getAllKudos.execute();
    
    // Assert
    expect(mockKudosRepository.getAllKudosPopulated).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(mockKudosRepository.getTotalCount).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(
      ResponseMapper.success(
        mockKudosListItems,
        `Retrieved ${mockKudosListItems.length} kudos successfully`,
        { total, offset: 0, limit: mockKudosListItems.length }
      )
    );
  });
  
  it('should handle date filters correctly', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const total = 1;
    const filters: KudosFilters = {
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31')
    };
    
    // Mock repository responses
    mockKudosRepository.getAllKudosPopulated.mockResolvedValue([mockKudosListItems[0]]);
    mockKudosRepository.getTotalCount.mockResolvedValue(total);
    
    // Act
    const result = await getAllKudos.execute(limit, offset, filters);
    
    // Assert
    expect(mockKudosRepository.getAllKudosPopulated).toHaveBeenCalledWith(limit, offset, filters);
    expect(mockKudosRepository.getTotalCount).toHaveBeenCalledWith(filters);
    expect(result).toEqual(
      ResponseMapper.success(
        [mockKudosListItems[0]],
        `Retrieved 1 kudos successfully`,
        { total, offset, limit }
      )
    );
  });
  
  it('should return empty array when no kudos match filters', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const total = 0;
    const filters: KudosFilters = {
      receiverId: 'nonexistent-user'
    };
    
    const emptyArray: KudosListItemDTO[] = [];
    
    // Mock repository responses
    mockKudosRepository.getAllKudosPopulated.mockResolvedValue(emptyArray);
    mockKudosRepository.getTotalCount.mockResolvedValue(total);
    
    // Act
    const result = await getAllKudos.execute(limit, offset, filters);
    
    // Assert
    expect(mockKudosRepository.getAllKudosPopulated).toHaveBeenCalledWith(limit, offset, filters);
    expect(mockKudosRepository.getTotalCount).toHaveBeenCalledWith(filters);
    expect(result).toEqual(
      ResponseMapper.success(
        emptyArray,
        `Retrieved 0 kudos successfully`,
        { total, offset, limit }
      )
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockKudosRepository.getAllKudosPopulated.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await getAllKudos.execute();
    
    // Assert
    expect(mockKudosRepository.getAllKudosPopulated).toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 