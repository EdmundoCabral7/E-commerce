import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../schemas/category.schema';
import { slugify } from '../utils/slugify';
import { AppError } from '../middlewares/errorHandler';
import { deleteImage } from '../config/cloudinary';

const categoryRepository = new CategoryRepository();

export class CategoryService {
  /**
   * Lista categorias ativas de uma organização.
   */
  async getAll(organizationId: string, onlyActive: boolean = true) {
    return categoryRepository.findAll(organizationId, onlyActive);
  }

  /**
   * Busca categoria por ID e organização.
   */
  async getById(id: string, organizationId: string) {
    const category = await categoryRepository.findById(id, organizationId);
    if (!category) throw new AppError('Categoria não encontrada.', 404);
    return category;
  }

  /**
   * Cria uma nova categoria.
   */
  async create(organizationId: string, data: CreateCategoryDTO, file?: any) {
    // Valida se já existe categoria com o mesmo nome na organização
    const existingName = await categoryRepository.findByName(data.name, organizationId);
    if (existingName) throw new AppError('Já existe uma categoria com este nome na sua loja.', 409);

    const slug = slugify(data.name);

    // Valida se o slug gerado já existe
    const existingSlug = await categoryRepository.findBySlug(slug, organizationId);
    if (existingSlug) throw new AppError('O nome da categoria resultou em um link (slug) já existente.', 409);

    return categoryRepository.create({
      ...data,
      slug,
      organizationId,
      imageUrl: file?.path || null,
      imagePublicId: file?.filename || null,
    });
  }

  /**
   * Atualiza uma categoria.
   */
  async update(id: string, organizationId: string, data: UpdateCategoryDTO, file?: any) {
    const category = await this.getById(id, organizationId);

    // Se o nome mudou, valida unicidade e atualiza o slug
    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      const existingName = await categoryRepository.findByName(data.name, organizationId);
      if (existingName) throw new AppError('Já existe uma categoria com este nome.', 409);
      slug = slugify(data.name);
    }

    const updateData: any = { ...data, slug };

    // Se uma nova imagem foi enviada, deleta a antiga do Cloudinary
    if (file) {
      if (category.imagePublicId) {
        await deleteImage(category.imagePublicId);
      }
      updateData.imageUrl = file.path;
      updateData.imagePublicId = file.filename;
    }

    return categoryRepository.update(id, organizationId, updateData);
  }

  /**
   * Remove uma categoria (apenas se não houver produtos vinculados).
   */
  async delete(id: string, organizationId: string) {
    const category = await this.getById(id, organizationId);

    // Verifica se há produtos vinculados
    const productCount = await categoryRepository.countProducts(id);
    if (productCount > 0) {
      throw new AppError('Não é possível excluir uma categoria que possui produtos vinculados.', 400);
    }

    // Deleta imagem do Cloudinary se existir
    if (category.imagePublicId) {
      await deleteImage(category.imagePublicId);
    }

    return categoryRepository.delete(id);
  }
}
