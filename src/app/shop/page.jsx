'use client';
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ProductCard from '@/components/Product/ProductCard';
import ProductFilter from '@/components/Product/ProductFilter';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '@/lib/features/auth/wishlistSlice';
import { selectIsAuthenticated } from '@/lib/features/auth/selector';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const PRODUCTS_PER_PAGE = 9;

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentFilters, setCurrentFilters] = useState({
        category: 'all',
        sort: 'default',
        stock: false,
        newArrivals: false,
    });

    const categories = ['candles', 'cookies', 'chocolates'];
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    const applyFrontendFilters = useCallback((allProds, filters) => {
        let result = [...allProds];

        if (filters.category !== 'all') {
            result = result.filter(product => product.category.toLowerCase() === filters.category.toLowerCase());
        }

        if (filters.stock) {
            result = result.filter(product => product.stock > 0);
        }

        if (filters.newArrivals) {
            result = result.filter(product => product.isFeatured);
        }

        switch (filters.sort) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
            default:
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        setFilteredProducts(result);
    }, []);

    const fetchProducts = useCallback(async (page, filters, append = false) => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page: page,
                limit: PRODUCTS_PER_PAGE,
                category: filters.category !== 'all' ? filters.category : undefined,
                inStock: filters.stock ? true : undefined,
                isFeatured: filters.newArrivals ? true : undefined,
                sortBy: filters.sort,
            };

            const response = await axios.get(`${BACKEND_URL}/api/products`, { params });
            const newProducts = response.data;

            setProducts(prevProducts => {
                const updatedProducts = append ? [...prevProducts, ...newProducts] : newProducts;
                setTotalProducts(updatedProducts.length);
                applyFrontendFilters(updatedProducts, filters);
                return updatedProducts;
            });

            setCurrentPage(page);
            setHasMore(newProducts.length === PRODUCTS_PER_PAGE);

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Failed to fetch products from server.');
            } else {
                setError('Network error or unexpected issue. Please check your internet connection.');
            }
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [applyFrontendFilters]);

    useEffect(() => {
        fetchProducts(1, currentFilters, false);
    }, [fetchProducts, currentFilters]);

    const handleFilterChange = (newFilters) => {
        setCurrentFilters(newFilters);
        fetchProducts(1, newFilters, false);
    };

    const handleLoadMore = () => {
        fetchProducts(currentPage + 1, currentFilters, true);
    };

    return (
        <>
            <Head>
                <title>Shop | flame&crumble</title>
                <meta name="description" content="Browse our handcrafted products" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-[#FFF5F7]">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="mb-12 mt-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Discover Our Collection</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Handcrafted with love, delivered with care
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center justify-between">
                            <span>{error}</span>
                            <button 
                                onClick={() => setError('')} 
                                className="text-red-700 hover:text-red-900"
                                aria-label="Close error message"
                            >
                                &times;
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filter */}
                        <div className="lg:w-72 lg:sticky lg:top-24 lg:self-start">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-6 text-gray-900">Filter Products</h2>
                                <ProductFilter
                                    categories={categories.map(cat => ({ 
                                        value: cat, 
                                        label: cat.charAt(0).toUpperCase() + cat.slice(1) 
                                    }))}
                                    onFilterChange={handleFilterChange}
                                    initialFilters={currentFilters}
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-600">
                                    Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> of{' '}
                                    <span className="font-medium text-gray-900">{totalProducts}</span> products
                                </p>
                            </div>

                            {/* Loading State */}
                            {loading && products.length === 0 && !error && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                                            <div className="h-64 bg-gray-200"></div>
                                            <div className="p-5 space-y-3">
                                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Products Grid */}
                            {!loading && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <ProductCard 
                                                key={product._id} 
                                                product={{
                                                    id: product._id,
                                                    name: product.name,
                                                    description: product.description || 'No description available',
                                                    price: product.price,
                                                    category: product.category,
                                                    image: product.image,
                                                    stock: product.stock > 0,
                                                    isNew: product.isFeatured,
                                                }} 
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-3 text-center py-12">
                                            <div className="mx-auto max-w-md">
                                                <svg 
                                                    className="mx-auto h-12 w-12 text-gray-400" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={1.5} 
                                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                                    />
                                                </svg>
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                                                <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                                                <div className="mt-6">
                                                    <button
                                                        onClick={() => handleFilterChange({
                                                            category: 'all',
                                                            sort: 'default',
                                                            stock: false,
                                                            newArrivals: false,
                                                        })}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#E30B5D] hover:bg-[#C90A53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E30B5D] transition-colors duration-200"
                                                    >
                                                        Reset all filters
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                        className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                                            loading 
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                                : 'bg-[#E30B5D] text-white hover:bg-[#C90A53] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                        }`}
                                        aria-label={loading ? "Loading more products" : "Load more products"}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg 
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Loading...
                                            </span>
                                        ) : (
                                            'Load More Products'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}