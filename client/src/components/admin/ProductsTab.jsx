const ProductsTab = ({ products, onEdit, onDelete, onStockUpdate, onAddNew }) => {
  return (
    <div>
      <button onClick={onAddNew} className="btn-primary btn-ripple mb-6">
        Add New Product
      </button>
      <div className="space-y-3">
        {products.map((p, i) => (
          <div
            key={p._id}
            className="border rounded-xl p-4 dark:border-gray-800 flex items-center space-x-4 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <img
              src={p.images?.[0] || "/placeholder.png"}
              alt={p.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{p.title}</p>
              <p className="text-xs text-gray-500">
                ${p.price} / Stock: {p.stock}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="number"
                  value={p.stock}
                  onChange={(e) => onStockUpdate(p._id, parseInt(e.target.value))}
                  className="input-field text-xs w-20"
                  min="0"
                />
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.stock > 20 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  p.stock > 5 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {p.stock > 20 ? "In Stock" : p.stock > 5 ? "Low Stock" : "Critical"}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(p)}
                className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(p._id)}
                className="px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTab;
