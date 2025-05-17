import { Router } from 'express';
import { KudosCategoryController } from '../controllers/KudosCategoryController';
import { CreateKudosCategory } from '../../application/useCases/category/CreateKudosCategory';
import { GetAllKudosCategories } from '../../application/useCases/category/GetAllKudosCategories';
import { KudosCategoryRepositoryImpl } from '../../infrastructure/repositories/KudosCategoryRepositoryImpl';
import { iconUpload } from '../../infrastructure/services/FileUploadService';

export const categoryRouter = Router();

// Initialize dependencies
const kudosCategoryRepository = new KudosCategoryRepositoryImpl();
const createKudosCategoryUseCase = new CreateKudosCategory(kudosCategoryRepository);
const getAllKudosCategoriesUseCase = new GetAllKudosCategories(kudosCategoryRepository);
const categoryController = new KudosCategoryController(
  createKudosCategoryUseCase,
  getAllKudosCategoriesUseCase
);

// Initialize default categories
kudosCategoryRepository.initializeDefaultCategories().catch(err => {
  console.error('Error initializing default categories:', err);
});

// Define routes
categoryRouter.post('/create', iconUpload, (req, res) => categoryController.createCategory(req, res));
categoryRouter.get('/', (req, res) => categoryController.getAllCategories(req, res)); 