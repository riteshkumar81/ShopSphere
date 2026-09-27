const API_URL = `${import.meta.env.VITE_API_URL}/products`;
const getProducts = async () => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
  } catch (error) {
    console.error('Product fetch error:', error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }

    return data;
  } catch (error) {
    console.error('Product fetch error:', error);
    throw error;
  }
};

const productService = {
  getProducts,
  getProductById,
};

export default productService;