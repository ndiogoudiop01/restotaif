'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Phone, Search, Star, Plus, Minus, X, MapPin, Clock, CreditCard } from 'lucide-react';
import Footer from '@/components/layout/Footer';

// Types
interface MenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  description: string;
  variants: Variant[];
  customizations: Customization[];
  inStock: boolean;
  rating: number;
}

interface Variant {
  id: string;
  name: string;
  price: number;
}

interface Customization {
  id: string;
  name: string;
  price: number;
  free: boolean;
}

interface CartItem {
  id: string;
  menuItem: MenuItem;
  variant: Variant;
  customizations: Customization[];
  quantity: number;
  totalPrice: number;
}

interface User {
  id: string;
  name: string;
  phone: string;
  points: number;
}

// Données de test
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    category: 'pizza',
    basePrice: 2500,
    image: 'menu/PIZZA-MARGHERITA.jpg',
    description: 'Pizza classique avec sauce tomate, mozzarella et basilic frais',
    variants: [
      { id: 'small', name: 'Petite', price: 0 },
      { id: 'medium', name: 'Moyenne', price: 500 },
      { id: 'large', name: 'Grande', price: 1000 }
    ],
    customizations: [
      { id: 'extra-cheese', name: 'Extra fromage', price: 500, free: false },
      { id: 'ketchup', name: 'Ketchup', price: 0, free: true },
      { id: 'piment', name: 'Piment', price: 0, free: true }
    ],
    inStock: true,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Tacos Poulet',
    category: 'tacos',
    basePrice: 3000,
    image: 'menu/tacos_poulet.jpg',
    description: 'Tacos savoureux avec poulet grillé, légumes frais et sauce spéciale',
    variants: [
      { id: 'simple', name: 'Simple', price: 0 },
      { id: 'double', name: 'Double viande', price: 1000 }
    ],
    customizations: [
      { id: 'extra-fries', name: 'Extra frites', price: 500, free: false },
      { id: 'ketchup', name: 'Ketchup', price: 0, free: true },
      { id: 'piment', name: 'Piment', price: 0, free: true }
    ],
    inStock: true,
    rating: 4.3
  },
  {
    id: '3',
    name: 'Hamburger Classic',
    category: 'hamburger',
    basePrice: 4000,
    image: 'menu/hamburger.jpg',
    description: 'Hamburger gourmand avec steak, fromage, légumes et sauce maison',
    variants: [
      { id: 'simple', name: 'Simple', price: 0 },
      { id: 'double', name: 'Double steak', price: 1500 }
    ],
    customizations: [
      { id: 'extra-cheese', name: 'Extra fromage', price: 500, free: false },
      { id: 'extra-fries', name: 'Extra frites', price: 500, free: false },
      { id: 'ketchup', name: 'Ketchup', price: 0, free: true }
    ],
    inStock: true,
    rating: 4.7
  }
];

const categories = [
  { id: 'all', name: 'Tous', icon: '🍽️' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'tacos', name: 'Tacos', icon: '🌮' },
  { id: 'hamburger', name: 'Hamburger', icon: '🍔' },
  { id: 'chicken', name: 'Poulet', icon: '🍗' },
  { id: 'frites', name: 'Frites', icon: '🍟' },
  { id: 'taftaf', name: 'TafTaf', icon: '⚡' }
];

const deliveryModes = [
  { id: 'livraison', name: 'Livraison', icon: '🚚', description: 'Livré chez vous' },
  { id: 'emporter', name: 'À emporter', icon: '🎒', description: 'Récupérer sur place' },
  { id: 'taftaf', name: 'TafTaf', icon: '⚡', description: 'Livraison express' }
];

export default function FoodDeliveryApp() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deliveryMode, setDeliveryMode] = useState('livraison');
  const [searchTerm, setSearchTerm] = useState('');

  // Persistance du panier
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const filteredItems = menuItems.filter(item => 
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: MenuItem, variant: Variant, customizations: Customization[], quantity: number) => {
    const totalPrice = item.basePrice + variant.price + customizations.reduce((sum, c) => sum + c.price, 0);
    const cartItem: CartItem = {
      id: Date.now().toString(),
      menuItem: item,
      variant,
      customizations,
      quantity,
      totalPrice
    };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Composant Navigation
  const Navigation = () => (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">RestoTaîf</h1>
            <div className="hidden md:flex space-x-6">
              {['accueil', 'menu', 'paiement', 'livraison', 'fidelite', 'securite', 'sav', 'contact'].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`capitalize px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={() => setCurrentPage('panier')}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.name}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {user.points} pts
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Composant Carte de Plat
  const MenuCard = ({ item }: { item: MenuItem }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{item.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">{item.basePrice.toLocaleString()} FCFA</span>
          <button
            onClick={() => {
              setSelectedItem(item);
              setShowItemModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
        {!item.inStock && (
          <div className="mt-2 text-red-500 text-sm font-medium">Rupture de stock</div>
        )}
      </div>
    </div>
  );

  // Modal d'authentification
  const AuthModal = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = () => {
      if (name && phone) {
        if (isLogin) {
          // Simulation de connexion
          setUser({ id: '1', name, phone, points: 150 });
        } else {
          // Simulation d'inscription
          setUser({ id: '1', name, phone, points: 0 });
        }
        setShowAuthModal(false);
        setName('');
        setPhone('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isLogin ? 'Connexion' : 'Inscription'}</h2>
            <button onClick={() => setShowAuthModal(false)}>
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom complet"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="77 123 45 67"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLogin ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal d'ajout d'article
  const ItemModal = () => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState<Customization[]>([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
      if (selectedItem && selectedItem.variants.length > 0) {
        setSelectedVariant(selectedItem.variants[0]);
      }
    }, [selectedItem]);

    if (!selectedItem) return null;

    const totalPrice = selectedItem.basePrice + 
      (selectedVariant?.price || 0) + 
      selectedCustomizations.reduce((sum, c) => sum + c.price, 0);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedItem.name}</h2>
            <button onClick={() => setShowItemModal(false)}>
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover rounded-lg mb-4" />
          
          {/* Variantes */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Taille</h3>
            <div className="space-y-2">
              {selectedItem.variants.map(variant => (
                <label key={variant.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={selectedVariant?.id === variant.id}
                    onChange={() => setSelectedVariant(variant)}
                    className="text-blue-600"
                  />
                  <span>{variant.name}</span>
                  {variant.price > 0 && (
                    <span className="text-blue-600 font-medium">+{variant.price} FCFA</span>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          {/* Personnalisations */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Personnalisation</h3>
            <div className="space-y-2">
              {selectedItem.customizations.map(customization => (
                <label key={customization.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedCustomizations.some(c => c.id === customization.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomizations([...selectedCustomizations, customization]);
                      } else {
                        setSelectedCustomizations(selectedCustomizations.filter(c => c.id !== customization.id));
                      }
                    }}
                    className="text-blue-600"
                  />
                  <span>{customization.name}</span>
                  {customization.price > 0 ? (
                    <span className="text-blue-600 font-medium">+{customization.price} FCFA</span>
                  ) : (
                    <span className="text-green-600 text-sm">Gratuit</span>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          {/* Quantité */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Quantité</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                {(totalPrice * quantity).toLocaleString()} FCFA
              </span>
            </div>
            
            <button
              onClick={() => {
                if (selectedVariant) {
                  addToCart(selectedItem, selectedVariant, selectedCustomizations, quantity);
                  setShowItemModal(false);
                  setSelectedCustomizations([]);
                  setQuantity(1);
                }
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Page d'accueil
  const HomePage = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">Commandez vos plats préférés</h1>
            <p className="text-xl mb-6">Livraison rapide et savoureuse directement chez vous</p>
            <div className="flex space-x-4">
              {deliveryModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setDeliveryMode(mode.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    deliveryMode === mode.id ? 'bg-white text-blue-600' : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {mode.icon} {mode.name}
                </button>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-lg">Plus de 50 plats délicieux</p>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Catégories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Plats populaires */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory === 'all' ? 'Tous nos plats' : `Catégorie: ${categories.find(c => c.id === selectedCategory)?.name}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  // Page Panier
  const CartPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Votre panier est vide</h2>
          <button
            onClick={() => setCurrentPage('accueil')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Découvrir nos plats
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
              <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.menuItem.name}</h3>
                <p className="text-gray-600">{item.variant.name}</p>
                {item.customizations.length > 0 && (
                  <p className="text-sm text-gray-500">
                    + {item.customizations.map(c => c.name).join(', ')}
                  </p>
                )}
                <p className="text-blue-600 font-bold">{item.totalPrice.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">{totalCartPrice.toLocaleString()} FCFA</span>
            </div>
            <button
              onClick={() => setCurrentPage('paiement')}
              className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Procéder au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Page Paiement
  const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('orange');
    const [address, setAddress] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
      { id: 'orange', name: 'Orange Money', icon: '📱', fee: 0 },
      { id: 'wave', name: 'Wave', icon: '💳', fee: 0 },
      { id: 'card', name: 'Carte Bancaire', icon: '💳', fee: 100 },
      { id: 'cash', name: 'Espèces à la livraison', icon: '💵', fee: 0 }
    ];

    const deliveryFee = deliveryMode === 'taftaf' ? 1000 : deliveryMode === 'livraison' ? 500 : 0;
    const paymentFee = paymentMethods.find(p => p.id === paymentMethod)?.fee || 0;
    const finalTotal = totalCartPrice + deliveryFee + paymentFee;

    const handlePayment = () => {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      
      setIsProcessing(true);
      // Simulation du traitement
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentPage('suivi');
        // Ajouter des points de fidélité
        if (user) {
          const pointsEarned = Math.floor(finalTotal / 1000);
          setUser({ ...user, points: user.points + pointsEarned });
        }
      }, 3000);
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Paiement</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Aucun article dans votre panier</p>
            <button
              onClick={() => setCurrentPage('accueil')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de paiement */}
            <div className="space-y-6">
              {/* Mode de livraison */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Mode de livraison</h2>
                <div className="space-y-3">
                  {deliveryModes.map(mode => (
                    <label key={mode.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={deliveryMode === mode.id}
                        onChange={() => setDeliveryMode(mode.id)}
                        className="text-blue-600"
                      />
                      <span className="text-xl">{mode.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-sm text-gray-600">{mode.description}</div>
                      </div>
                      <div className="font-medium text-blue-600">
                        {mode.id === 'taftaf' ? '1 000 FCFA' : mode.id === 'livraison' ? '500 FCFA' : 'Gratuit'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Adresse de livraison */}
              {deliveryMode !== 'emporter' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Saisissez votre adresse complète..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              )}

              {/* Méthode de paiement */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Méthode de paiement</h2>
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <label key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="text-blue-600"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        {method.fee > 0 && (
                          <div className="text-sm text-gray-600">Frais: {method.fee} FCFA</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes de commande */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Notes pour la commande</h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Instructions spéciales, allergies, etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <div className="font-medium">{item.menuItem.name} ({item.variant.name})</div>
                      <div className="text-sm text-gray-600">Qté: {item.quantity}</div>
                    </div>
                    <div className="font-medium">{(item.totalPrice * item.quantity).toLocaleString()} FCFA</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{totalCartPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{deliveryFee.toLocaleString()} FCFA</span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between">
                    <span>Frais de paiement</span>
                    <span>{paymentFee.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{finalTotal.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || (deliveryMode !== 'emporter' && !address)}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Traitement en cours...</span>
                  </div>
                ) : (
                  'Confirmer la commande'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Page Suivi de commande
  const TrackingPage = () => {
    const [orderStatus, setOrderStatus] = useState('confirmed');
    const [deliveryPerson, setDeliveryPerson] = useState({
      name: 'Moussa Diop',
      phone: '77 123 45 67',
      rating: 4.8
    });

    const orderSteps = [
      { id: 'confirmed', label: 'Commande confirmée', icon: '✅', completed: true },
      { id: 'preparing', label: 'En préparation', icon: '👨‍🍳', completed: orderStatus !== 'confirmed' },
      { id: 'ready', label: 'Prête', icon: '📦', completed: ['ready', 'picked', 'delivered'].includes(orderStatus) },
      { id: 'picked', label: 'Récupérée par livreur', icon: '🏃‍♂️', completed: ['picked', 'delivered'].includes(orderStatus) },
      { id: 'delivered', label: 'Livrée', icon: '🎉', completed: orderStatus === 'delivered' }
    ];

    useEffect(() => {
      // Simulation de progression automatique
      const interval = setInterval(() => {
        setOrderStatus(current => {
          const steps = ['confirmed', 'preparing', 'ready', 'picked', 'delivered'];
          const currentIndex = steps.indexOf(current);
          if (currentIndex < steps.length - 1) {
            return steps[currentIndex + 1];
          }
          return current;
        });
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Suivi de commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progression */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">État de votre commande</h2>
            
            <div className="space-y-4">
              {orderSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                      {step.icon} {step.label}
                    </div>
                    {step.id === orderStatus && (
                      <div className="text-sm text-blue-600 font-medium">En cours...</div>
                    )}
                  </div>
                  {step.completed && (
                    <div className="text-sm text-gray-500">
                      {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Barre de progression */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(orderSteps.filter(s => s.completed).length / orderSteps.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Progression: {orderSteps.filter(s => s.completed).length}/{orderSteps.length} étapes
              </div>
            </div>
          </div>

          {/* Informations livreur */}
          {['picked', 'delivered'].includes(orderStatus) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Votre livreur</h2>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {deliveryPerson.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-lg">{deliveryPerson.name}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{deliveryPerson.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => window.open(`tel:${deliveryPerson.phone}`)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler {deliveryPerson.phone}</span>
                </button>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Suivre sur la carte</span>
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Temps estimé:</strong> 15-20 minutes
                </div>
              </div>
            </div>
          )}

          {/* Récapitulatif commande */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Votre commande</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.menuItem.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.variant.name} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">{(item.totalPrice * item.quantity).toLocaleString()} FCFA</div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">{totalCartPrice.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        {orderStatus === 'delivered' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Commande livrée !</h2>
            <p className="text-green-700 mb-4">Merci d'avoir choisi RESTOTAIF. Bon appétit !</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setCart([]);
                  setCurrentPage('accueil');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle commande
              </button>
              <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                Évaluer la commande
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Page Fidélité
  const LoyaltyPage = () => {
    const [selectedReward, setSelectedReward] = useState(null);
    
    const loyaltyTiers = [
      { name: 'Bronze', min: 0, max: 499, color: 'bg-amber-600', benefits: ['5% de réduction', 'Livraison gratuite dès 5000 FCFA'] },
      { name: 'Argent', min: 500, max: 1499, color: 'bg-gray-400', benefits: ['10% de réduction', 'Livraison gratuite dès 3000 FCFA', 'Accès prioritaire aux promotions'] },
      { name: 'Or', min: 1500, max: 2999, color: 'bg-yellow-500', benefits: ['15% de réduction', 'Livraison toujours gratuite', 'Plat offert chaque mois'] },
      { name: 'Platine', min: 3000, max: 999999, color: 'bg-purple-600', benefits: ['20% de réduction', 'Livraison express gratuite', 'Menu VIP exclusif'] }
    ];

    const rewards = [
      { id: 1, name: 'Pizza Margherita gratuite', points: 200, type: 'food', icon: '🍕' },
      { id: 2, name: 'Livraison gratuite', points: 50, type: 'delivery', icon: '🚚' },
      { id: 3, name: 'Boisson offerte', points: 30, type: 'drink', icon: '🥤' },
      { id: 4, name: '10% de réduction', points: 100, type: 'discount', icon: '💰' },
      { id: 5, name: 'Dessert au choix', points: 80, type: 'food', icon: '🍰' }
    ];

    const currentTier = loyaltyTiers.find(tier => 
      user && user.points >= tier.min && user.points <= tier.max
    ) || loyaltyTiers[0];

    const nextTier = loyaltyTiers.find(tier => 
      user && user.points < tier.min
    );

    const progressToNext = nextTier ? 
      ((user?.points || 0) - currentTier.min) / (nextTier.min - currentTier.min) * 100 : 100;

    const redeemReward = (reward) => {
      if (user && user.points >= reward.points) {
        setUser({ ...user, points: user.points - reward.points });
        alert(`Récompense "${reward.name}" échangée avec succès !`);
      }
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Programme de Fidélité</h1>

        {!user ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold mb-4">Rejoignez notre programme de fidélité</h2>
            <p className="text-gray-600 mb-6">Gagnez des points à chaque commande et débloquez des récompenses exclusives</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              S'inscrire maintenant
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statut actuel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Salut {user.name} ! 👋</h2>
                  <p className="text-gray-600">Votre statut de fidélité</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{user.points}</div>
                  <div className="text-sm text-gray-600">points disponibles</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className={`px-4 py-2 rounded-lg text-white font-bold ${currentTier.color}`}>
                  {currentTier.name}
                </div>
                {nextTier && (
                  <div className="text-gray-600">
                    → {nextTier.min - user.points} points pour {nextTier.name}
                  </div>
                )}
              </div>

              {nextTier && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{currentTier.name}</span>
                    <span>{nextTier.name}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressToNext, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold mb-2">Vos avantages actuels :</h3>
                  <ul className="space-y-1">
                    {currentTier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Comment gagner des points :</strong></p>
                  <p>• 1 point = 1000 FCFA dépensés</p>
                  <p>• Bonus de 50 points à l'inscription</p>
                  <p>• Bonus de 20 points par avis laissé</p>
                </div>
              </div>
            </div>

            {/* Récompenses disponibles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Récompenses disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map(reward => (
                  <div key={reward.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{reward.icon}</div>
                      <h3 className="font-bold">{reward.name}</h3>
                      <p className="text-blue-600 font-bold">{reward.points} points</p>
                    </div>
                    <button
                      onClick={() => redeemReward(reward)}
                      disabled={user.points < reward.points}
                      className="w-full py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {user.points >= reward.points ? 'Échanger' : 'Pas assez de points'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique des points */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Historique récent</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Commande #12345</div>
                    <div className="text-sm text-gray-600">Il y a 2 jours</div>
                  </div>
                  <div className="text-green-600 font-bold">+15 points</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Bonus inscription</div>
                    <div className="text-sm text-gray-600">Il y a 1 semaine</div>
                  </div>
                  <div className="text-green-600 font-bold">+50 points</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Avis laissé</div>
                    <div className="text-sm text-gray-600">Il y a 1 semaine</div>
                  </div>
                  <div className="text-green-600 font-bold">+20 points</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Page SAV
  const CustomerServicePage = () => {
    const [activeTab, setActiveTab] = useState('faq');
    const [chatMessages, setChatMessages] = useState([
      { id: 1, sender: 'bot', message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', time: '14:30' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [ticketForm, setTicketForm] = useState({ subject: '', category: 'commande', message: '' });

    const faqData = [
      {
        category: 'Commandes',
        questions: [
          { q: 'Comment passer une commande ?', a: 'Parcourez notre menu, ajoutez les articles à votre panier, puis procédez au paiement.' },
          { q: 'Puis-je modifier ma commande ?', a: 'Oui, vous pouvez modifier votre commande avant qu\'elle ne soit confirmée par le restaurant.' },
          { q: 'Combien de temps pour la livraison ?', a: 'Livraison standard : 30-45 min, TafTaf : 15-20 min, À emporter : 15-20 min.' }
        ]
      },
      {
        category: 'Paiement',
        questions: [
          { q: 'Quels modes de paiement acceptez-vous ?', a: 'Orange Money, Wave, Carte bancaire, et Espèces à la livraison.' },
          { q: 'Le paiement est-il sécurisé ?', a: 'Oui, tous nos paiements sont sécurisés avec chiffrement SSL 256 bits.' },
          { q: 'Puis-je avoir une facture ?', a: 'Oui, une facture vous est automatiquement envoyée par SMS après chaque commande.' }
        ]
      },
      {
        category: 'Livraison',
        questions: [
          { q: 'Dans quelles zones livrez-vous ?', a: 'Nous livrons dans tout Dakar et sa banlieue. Vérifiez la disponibilité lors de la commande.' },
          { q: 'Frais de livraison ?', a: 'Livraison standard : 500 FCFA, TafTaf : 1000 FCFA, Gratuite dès 5000 FCFA.' },
          { q: 'Puis-je suivre ma commande ?', a: 'Oui, vous recevez un lien de suivi par SMS après confirmation de votre commande.' }
        ]
      }
    ];

    const sendMessage = () => {
      if (newMessage.trim()) {
        const userMessage = {
          id: Date.now(),
          sender: 'user',
          message: newMessage,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([...chatMessages, userMessage]);
        setNewMessage('');
        
        // Simulation de réponse automatique
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            message: 'Merci pour votre message. Un de nos conseillers va vous répondre dans les plus brefs délais.',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          };
          setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
      }
    };

    const submitTicket = () => {
      if (ticketForm.subject && ticketForm.message) {
        alert('Votre ticket a été créé avec succès ! Numéro de ticket : #' + Math.random().toString(36).substr(2, 9).toUpperCase());
        setTicketForm({ subject: '', category: 'commande', message: '' });
      }
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Service Client</h1>

        {/* Tabs */}
        <div className="flex flex-wrap space-x-4 mb-8 border-b">
          {[
            { id: 'faq', label: 'FAQ', icon: '❓' },
            { id: 'chat', label: 'Chat en direct', icon: '💬' },
            { id: 'ticket', label: 'Créer un ticket', icon: '🎫' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, index) => (
                    <details key={index} className="border rounded-lg">
                      <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium">
                        {item.q}
                      </summary>
                      <div className="p-4 pt-0 text-gray-600">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat en direct */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">Chat en direct</h2>
              <p className="text-blue-100">Nos conseillers sont disponibles 24h/24</p>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p>{message.message}</p>
                    <p className="text-xs mt-1 opacity-75">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Créer un ticket */}
        {activeTab === 'ticket' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Créer un ticket de support</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="commande">Problème de commande</option>
                  <option value="paiement">Problème de paiement</option>
                  <option value="livraison">Problème de livraison</option>
                  <option value="qualite">Qualité des produits</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Résumé de votre problème"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
                <textarea
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre problème en détail..."
                />
              </div>

              <button
                onClick={submitTicket}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer le ticket
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Page Sécurité
  const SecurityPage = () => {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sécurité et Confidentialité</h1>
        
        <div className="space-y-8">
          {/* Sécurité des données */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <span>🔒</span>
              <span>Sécurité de vos données</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Chez RESTOTAIF, nous prenons la sécurité de vos données très au sérieux :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Chiffrement SSL 256 bits</strong> : Toutes vos données sont chiffrées lors de la transmission</li>
                <li><strong>Stockage sécurisé</strong> : Vos informations sont stockées sur des serveurs sécurisés avec accès restreint</li>
                <li><strong>Conformité RGPD</strong> : Nous respectons les normes européennes de protection des données</li>
                <li><strong>Audits réguliers</strong> : Nos systèmes sont audités régulièrement par des experts en sécurité</li>
              </ul>
            </div>
          </div>

          {/* Sécurité des paiements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <span>💳</span>
              <span>Sécurité des paiements</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Vos paiements sont protégés par plusieurs niveaux de sécurité :</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2">Orange Money & Wave</h3>
                  <p className="text-sm">Paiements sécurisés via les API officielles avec authentification double facteur</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2">Cartes bancaires</h3>
                  <p className="text-sm">Traitement via des processeurs de paiement certifiés PCI DSS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confidentialité */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <span>🛡️</span>
              <span>Politique de confidentialité</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="font-bold">Collecte de données</h3>
              <p>Nous collectons uniquement les informations nécessaires pour :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Traiter vos commandes</li>
                <li>Améliorer nos services</li>
                <li>Vous contacter si nécessaire</li>
              </ul>
              
              <h3 className="font-bold mt-6">Utilisation des données</h3>
              <p>Vos données ne sont jamais vendues à des tiers. Elles sont utilisées uniquement pour :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Gestion de vos commandes</li>
                <li>Programme de fidélité</li>
                <li>Support client</li>
                <li>Analyses statistiques anonymisées</li>
              </ul>
            </div>
          </div>

          {/* Contrôle de vos données */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <span>⚙️</span>
              <span>Contrôle de vos données</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">Vous avez le contrôle total de vos données personnelles :</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                  <h3 className="font-bold">Télécharger mes données</h3>
                  <p className="text-sm text-gray-600">Obtenez une copie de toutes vos données</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                  <h3 className="font-bold">Modifier mes informations</h3>
                  <p className="text-sm text-gray-600">Mettez à jour vos données personnelles</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                  <h3 className="font-bold">Supprimer mon compte</h3>
                  <p className="text-sm text-gray-600">Supprimez définitivement votre compte</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                  <h3 className="font-bold">Gérer les cookies</h3>
                  <p className="text-sm text-gray-600">Contrôlez les cookies et traceurs</p>
                </button>
              </div>
            </div>
          </div>

          {/* Contact sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Contact sécurité</h2>
            <p className="text-gray-700 mb-4">
              Si vous avez des questions sur la sécurité ou si vous détectez une vulnérabilité, contactez-nous :
            </p>
            <div className="space-y-2">
              <p><strong>Email :</strong> security@RESTOTAIF.sn</p>
              <p><strong>Téléphone :</strong> +221 33 123 45 67</p>
              <p><strong>Adresse :</strong> Dakar, Sénégal</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Page Contact
  const ContactPage = () => {
    const [contactForm, setContactForm] = useState({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    const submitContact = () => {
      if (contactForm.name && contactForm.message) {
        alert('Votre message a été envoyé ! Nous vous répondrons dans les 24h.');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contactez-nous</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations de contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Nos coordonnées</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Téléphone</div>
                    <div className="text-gray-600">+221 33 123 45 67</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white">📧</span>
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">contact@RESTOTAIF.sn</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Adresse</div>
                    <div className="text-gray-600">Plateau, Dakar, Sénégal</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Horaires</div>
                    <div className="text-gray-600">24h/24 - 7j/7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Suivez-nous</h2>
              <div className="flex space-x-4">
                <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                  f
                </button>
                <button className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700">
                  📷
                </button>
                <button className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500">
                  🐦
                </button>
                <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700">
                  📱
                </button>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Questions fréquentes</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Temps de livraison moyen ?</h3>
                  <p className="text-sm text-gray-600">30-45 minutes en livraison standard</p>
                </div>
                <div>
                  <h3 className="font-medium">Zone de livraison ?</h3>
                  <p className="text-sm text-gray-600">Tout Dakar et sa banlieue</p>
                </div>
                <div>
                  <h3 className="font-medium">Commande minimum ?</h3>
                  <p className="text-sm text-gray-600">Aucun minimum requis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Envoyez-nous un message</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="77 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre message..."
                />
              </div>

              <button
                onClick={submitContact}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
           {/* <Footer /> */}
      </div>
      
    );
  };

  // Rendu conditionnel des pages
  const renderPage = () => {
    switch (currentPage) {
      case 'accueil':
        return <HomePage />;
      case 'panier':
        return <CartPage />;
      case 'menu':
        return <HomePage />;
      case 'paiement':
        return <PaymentPage />;
      case 'suivi':
        return <TrackingPage />;
      case 'livraison':
        return <TrackingPage />;
      case 'fidelite':
        return <LoyaltyPage />;
      case 'securite':
        return <SecurityPage />;
      case 'sav':
        return <CustomerServicePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 capitalize">{currentPage}</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-center text-gray-600">Page {currentPage} en cours de développement...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {renderPage()}
      
      {/* Modals */}
      {showAuthModal && <AuthModal />}
      {showItemModal && <ItemModal />}
    </div>
  );
}