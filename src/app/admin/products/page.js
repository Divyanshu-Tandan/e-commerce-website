"use client";

import { useState, useEffect } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockCount: "",
    imageUrl: "",
  });
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockCount: "",
    imageUrl: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (product) => {
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stockCount: product.stockCount,
      imageUrl: product.images[0] || "",
    });
    setEditImageFiles([]);
    setEditingProduct(product);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsEditUploading(true);
      let uploadedImageUrls = editingProduct.images || [];

      if (editImageFiles.length > 0) {
        uploadedImageUrls = [];
        for (const file of editImageFiles) {
          const uploadData = new FormData();
          uploadData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          });

          if (uploadRes.ok) {
            const uploadResult = await uploadRes.json();
            uploadedImageUrls.push(uploadResult.url);
          } else {
            const errorData = await uploadRes.json();
            alert(errorData.message || "Failed to upload image");
            setIsEditUploading(false);
            return;
          }
        }
      }

      const payload = {
        name: editFormData.name,
        description: editFormData.description,
        price: Number(editFormData.price),
        category: editFormData.category,
        stockCount: Number(editFormData.stockCount),
        images: uploadedImageUrls,
      };

      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update product");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsEditUploading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Something went wrong while deleting");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let uploadedImageUrls = [];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const uploadData = new FormData();
          uploadData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          });

          if (uploadRes.ok) {
            const uploadResult = await uploadRes.json();
            uploadedImageUrls.push(uploadResult.url);
          } else {
            const errorData = await uploadRes.json();
            alert(errorData.message || "Failed to upload image");
            setIsUploading(false);
            return;
          }
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stockCount: Number(formData.stockCount),
        images: uploadedImageUrls,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({ name: "", description: "", price: "", category: "", stockCount: "", imageUrl: "" });
        setImageFiles([]);
        setIsAdding(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create product");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isAdding ? "Cancel" : "Add Product"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 animate-fade-in-up">
          <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Price ($)</label>
                <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Stock Count</label>
                <input type="number" name="stockCount" required value={formData.stockCount} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Product Images (Select multiple)</label>
              <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files))} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-300 dark:hover:file:bg-zinc-700" />
              {imageFiles.length > 0 && <p className="text-xs text-zinc-500 mt-1">{imageFiles.length} file(s) selected.</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"></textarea>
            </div>
            <button type="submit" disabled={isUploading} className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg w-full disabled:opacity-50">
              {isUploading ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>)}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {products.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-zinc-500">No products found. Add one to get started!</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-zinc-500">{product.category}</td>
                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${product.stockCount > 10 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                        {product.stockCount} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(product._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Name</label>
                  <input type="text" name="name" required value={editFormData.name} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Category</label>
                  <input type="text" name="category" required value={editFormData.category} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Price ($)</label>
                  <input type="number" step="0.01" name="price" required value={editFormData.price} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Stock Count</label>
                  <input type="number" name="stockCount" required value={editFormData.stockCount} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Product Images (Upload multiple to replace all)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setEditImageFiles(Array.from(e.target.files))} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-300 dark:hover:file:bg-zinc-700" />
                {editImageFiles.length > 0 ? (
                  <p className="text-xs text-zinc-500 mt-1">{editImageFiles.length} file(s) selected to replace existing.</p>
                ) : (
                  <p className="text-xs text-zinc-500 mt-1">Current images will be kept if no new files are selected.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" required value={editFormData.description} onChange={handleEditChange} rows="3" className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"></textarea>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isEditUploading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors">
                  {isEditUploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
