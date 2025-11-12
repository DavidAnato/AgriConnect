import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { apiService, apiFormDataRequest } from '../../services/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Légumes',
    price: '',
    unit: 'kg',
    quantity_available: '',
    location: '',
    image_url: '',
    status: 'available' as 'available' | 'reserved' | 'sold_out',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'Légumes',
    'Fruits',
    'Céréales',
    'Tubercules',
    'Viandes',
    'Produits laitiers',
    'Autres',
  ];

  const units = ['kg', 'g', 'litre', 'pièce', 'sac', 'botte'];

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await apiService.getProduct(parseInt(id!));
      
      if (product) {
        setFormData({
          name: product.name,
          description: product.short_description || product.long_description || product.description || '',
          category: product.category || 'Autres',
          price: String(product.unit_price ?? product.price ?? ''),
          unit: product.unit_type ?? product.unit ?? 'unité',
          quantity_available: String(product.quantity_available ?? product.availableQuantity ?? ''),
          location: product.location_village || product.location_commune || product.location || '',
          image_url: product.image || product.image_url || '',
          status: (Number(product.quantity_available ?? product.availableQuantity ?? 0) > 0) ? 'available' : 'sold_out',
        });

        // Prévisualisation si une image existe
        if (product.image || product.image_url) {
          setImagePreview(product.image || product.image_url);
        } else {
          setImagePreview('');
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Erreur lors du chargement du produit');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Construire FormData pour correspondre au serializer (et upload image)
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('short_description', formData.description);
      fd.append('category', formData.category);
      fd.append('unit_price', String(parseFloat(formData.price || '0')));
      fd.append('unit_type', formData.unit);
      fd.append('quantity_available', String(parseFloat(formData.quantity_available || '0')));
      if (formData.location) {
        fd.append('location_village', formData.location);
      }
      if (imageFile) {
        fd.append('image', imageFile);
      }

      const res = isEdit
        ? await apiFormDataRequest({ url: `/products/products/${id}/`, method: 'PATCH', data: fd })
        : await apiFormDataRequest({ url: '/products/products/', method: 'POST', data: fd });

      if (!res.ok) {
        let msg = 'Erreur de validation.';
        try {
          const data = await res.json();
          // Extraire premier message d’erreur
          const firstKey = Object.keys(data)[0];
          const firstErr = Array.isArray(data[firstKey]) ? data[firstKey][0] : String(data[firstKey]);
          msg = `${firstKey}: ${firstErr}`;
        } catch (_) {
          const text = await res.text();
          if (text) msg = text;
        }
        setError(msg);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/producer/products');
      }, 1500);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const onFileSelected = (file?: File) => {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    onFileSelected(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    onFileSelected(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f) {
          onFileSelected(f);
          break;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Modifiez les informations de votre produit' : 'Créez une nouvelle annonce'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Produit {isEdit ? 'modifié' : 'créé'} avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="Ex: Tomates fraîches"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="Décrivez votre produit, sa variété, son mode de culture..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unité *</label>
              <select
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité disponible *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.quantity_available}
                onChange={(e) =>
                  setFormData({ ...formData, quantity_available: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="Ex: Yamoussoukro, Bouaké"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du produit
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onPaste={handlePaste}
              className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-600"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="flex items-center justify-center">
                  <img src={imagePreview} alt="Prévisualisation" className="max-h-40 rounded-lg object-cover" />
                </div>
              ) : (
                <div className="text-gray-600">
                  Glissez-déposez une image, collez depuis le presse‑papiers,
                  ou cliquez pour sélectionner un fichier.
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            {formData.image_url && !imagePreview && (
              <p className="text-sm text-gray-500 mt-2">Image actuelle: {formData.image_url}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop, copier-coller d’une image, ou sélectionner un fichier.
            </p>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'available' | 'reserved' | 'sold_out',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="available">Disponible</option>
                <option value="reserved">Réservé</option>
                <option value="sold_out">Épuisé</option>
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/producer/products')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
