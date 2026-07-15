const ProductFormTab = ({
  productForm,
  setProductForm,
  editingId,
  images,
  setImages,
  onSubmit,
  onCancel,
}) => {
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const allColors = ["Black", "White", "Navy", "Blue", "Red", "Green", "Brown", "Grey", "Cream", "Olive"];
  const categories = ["shirts", "hoodies", "jeans", "shoes", "jackets", "accessories", "tshirts", "pants", "dresses", "shorts"];

  const toggleArrayItem = (key, value) => {
    const arr = productForm[key];
    const updated = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
    setProductForm({ ...productForm, [key]: updated });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <h2 className="font-semibold text-lg">
        {editingId ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <input
          type="text"
          value={productForm.title}
          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
          className="input-field input-glow"
          required
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <textarea
          value={productForm.description}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          className="input-field resize-none input-glow"
          rows="3"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div>
          <label className="text-sm font-medium mb-2 block">Price</label>
          <input
            type="number"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            className="input-field input-glow"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Discount %</label>
          <input
            type="number"
            value={productForm.discount}
            onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
            className="input-field input-glow"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <select
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            className="input-field"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Gender</label>
          <select
            value={productForm.gender}
            onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
            className="input-field"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <label className="text-sm font-medium mb-2 block">Stock</label>
        <input
          type="number"
          value={productForm.stock}
          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
          className="input-field input-glow"
          required
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "250ms" }}>
        <label className="text-sm font-medium mb-2 block">Sizes</label>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleArrayItem("sizes", s)}
              className={`px-3 py-1 text-xs border rounded-full transition-all duration-300 ${
                productForm.sizes.includes(s)
                  ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950 scale-105 shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-dark-800 hover:scale-105"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <label className="text-sm font-medium mb-2 block">Colors</label>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleArrayItem("colors", c)}
              className={`px-3 py-1 text-xs border rounded-full transition-all duration-300 ${
                productForm.colors.includes(c)
                  ? "bg-primary-950 text-white dark:bg-white dark:text-dark-950 scale-105 shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-dark-800 hover:scale-105"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "350ms" }}>
        <label className="text-sm font-medium mb-2 block">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="input-field"
        />
      </div>

      <label className="flex items-center space-x-2 text-sm cursor-pointer animate-slide-up" style={{ animationDelay: "400ms" }}>
        <input
          type="checkbox"
          checked={productForm.featured}
          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
          className="accent-primary-950"
        />
        <span>Featured Product</span>
      </label>

      <div className="flex space-x-4 animate-slide-up" style={{ animationDelay: "450ms" }}>
        <button type="submit" className="btn-primary btn-ripple">
          {editingId ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductFormTab;
