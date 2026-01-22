import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { categories } from '../../assets/assets';

const ProductList = () => {
   
  const {products , currency, axios, fetchProducts } = useAppContext();
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    offerPrice: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStock = async (id , inStock) =>{
    try {
        const {data} = await axios.post('/api/product/stock', {id , inStock})
        if(data.success){
            fetchProducts();
            toast.success(data.message);
        }else{
            toast.error(data.message);
        }
    } catch (error) {
            toast.error(error.message);
        
    }
  }

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: Array.isArray(product.description) ? product.description.join('\n') : product.description,
      category: product.category,
      price: product.price,
      offerPrice: product.offerPrice
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditForm({ name: '', description: '', category: '', price: '', offerPrice: '' });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit update
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { data } = await axios.post('/api/product/update', {
        id: editingProduct._id,
        ...editForm
      });

      if (data.success) {
        toast.success(data.message);
        if (data.priceDropNotificationsSent) {
          toast.success('Price drop notifications sent to customers!', { icon: '📧' });
        }
        fetchProducts();
        closeEditModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                <th className="px-4 py-3 font-semibold truncate">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {products.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 rounded overflow-hidden">
                                            <img src={product.image[0]} alt="Product" className="w-16" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input onClick = { ()=> toggleStock(product._id, !product.inStock)} checked= {product.inStock} type="checkbox" className="sr-only peer" />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => openEditModal(product)}
                                            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary-dull transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Product Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
                            <button 
                                onClick={closeEditModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdateProduct} className="p-4 space-y-4">
                            {/* Product Image Preview */}
                            <div className="flex items-center gap-3">
                                <img 
                                    src={editingProduct?.image[0]} 
                                    alt={editingProduct?.name} 
                                    className="w-20 h-20 object-cover rounded border"
                                />
                                <div>
                                    <p className="text-sm text-gray-500">Current Image</p>
                                    <p className="text-xs text-gray-400">(Image editing not available)</p>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700" htmlFor="edit-name">
                                    Product Name
                                </label>
                                <input 
                                    id="edit-name"
                                    name="name"
                                    type="text" 
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-primary"
                                    required 
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700" htmlFor="edit-description">
                                    Description (one point per line)
                                </label>
                                <textarea 
                                    id="edit-description"
                                    name="description"
                                    rows={4}
                                    value={editForm.description}
                                    onChange={handleInputChange}
                                    className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-primary resize-none"
                                ></textarea>
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700" htmlFor="edit-category">
                                    Category
                                </label>
                                <select 
                                    id="edit-category"
                                    name="category"
                                    value={editForm.category}
                                    onChange={handleInputChange}
                                    className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-primary"
                                >
                                    {categories.map((item, index) => (
                                        <option value={item.path} key={index}>{item.path}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Prices */}
                            <div className="flex gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="edit-price">
                                        Original Price
                                    </label>
                                    <input 
                                        id="edit-price"
                                        name="price"
                                        type="number" 
                                        value={editForm.price}
                                        onChange={handleInputChange}
                                        className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-primary"
                                        required 
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="edit-offerPrice">
                                        Offer Price
                                    </label>
                                    <input 
                                        id="edit-offerPrice"
                                        name="offerPrice"
                                        type="number" 
                                        value={editForm.offerPrice}
                                        onChange={handleInputChange}
                                        className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-primary"
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Price Drop Notice */}
                            {Number(editForm.offerPrice) < editingProduct?.offerPrice && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-700">
                                        📧 <strong>Price Drop Alert:</strong> Customers with this item in their cart will be notified about the price drop!
                                    </p>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 py-2 px-4 bg-primary text-white font-medium rounded hover:bg-primary-dull transition-colors disabled:opacity-50"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductList
