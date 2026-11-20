const categoryRepository = require('../repositories/category.repository');

class CategoryController {
  /**
   * [GET] /api/categories - Lấy danh sách thể loại
   */
  async getCategories(req, res, next) {
    try {
      const categories = await categoryRepository.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
