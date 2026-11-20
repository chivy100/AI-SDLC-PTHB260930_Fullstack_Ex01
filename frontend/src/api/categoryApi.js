import axiosClient from './axiosClient';

const categoryApi = {
  /**
   * Lấy danh sách thể loại để đưa vào dropdown select
   */
  getAll: () => {
    return axiosClient.get('/categories');
  }
};

export default categoryApi;
