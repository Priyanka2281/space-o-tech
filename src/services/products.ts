import Product from '../models/products';

interface ProductOrder {
    id: string;
    quantity: number;
  }
  
export const createProduct = async (productData: any) => {
    const product = new Product(productData);
    return product.save();
};

export const getAllProducts = async (page: number, limit: number) => {
    const products = await Product.find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await Product.countDocuments({ isDeleted: false });
    return { products, total };
};

export const getProductById = async (id: string) => {
    return Product.findById({ id, isDeleted: false });
};

export const updateProduct = async (id: string, productData: any) => {
    return Product.findByIdAndUpdate(id, productData);
};

export const deleteProduct = async (id: string) => {
    return Product.updateOne({ _id: id }, { $set: { isDeleted: true } });
};

export const buyProducts = async (products: ProductOrder[]) => {
    const results = [];
  
    for (const { id, quantity } of products) {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      if (product.stock < quantity) {
        throw new Error(`Not enough stock for product with id ${product.title}`);
      }
      product.stock -= quantity;
      await product.save();
      results.push(product);
    }
  
    return results;
  };
