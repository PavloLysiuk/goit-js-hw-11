import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38328018-adf92d25e5f0a3816743083dd';

export default class AxiosApiService {
  constructor() {
    this.axiosConfig = {
      method: 'GET',
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 50,
        safesearch: true,
        searchQuery: '',
        page: 1,
      },
    };
  }

  async fetchImages() {
    this.axiosConfig.params.q = this.query;

    const response = await axios(this.axiosConfig);
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this.axiosConfig.params.page += 1;
  }

  resetPage() {
    this.axiosConfig.params.page = 1;
  }

  get query() {
    return this.axiosConfig.params.searchQuery;
  }

  set query(newQuery) {
    this.axiosConfig.params.searchQuery = newQuery;
  }
}
