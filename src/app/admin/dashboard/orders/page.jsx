// app/admin/orders/page.jsx (Hypothetical standalone page for Order Management)
'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiEye, FiCheckCircle, FiTruck, FiClock } from 'react-icons/fi';
import AdminSidebar from '@/components/Dashboard/ui/AdminSidebar';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const OrderManagementPage = () => { // Renamed to denote it's a page component
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State for sidebar visibility

  // State for custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatusForUpdate, setNewStatusForUpdate] = useState('');

  // Effect to fetch orders when filterStatus changes
  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/orders`, {
        params: { status: filterStatus === 'all' ? undefined : filterStatus },
        withCredentials: true,
      });
      console.log("response at dashboard order=========================>", response.data);
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.error || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the actual status update after confirmation
  const confirmUpdateOrderStatus = async () => {
    if (!orderToUpdate || !newStatusForUpdate) return;

    setLoading(true);
    setError(null);
    setShowConfirmModal(false); // Close the modal
    try {
      // Adjusted API endpoint to match the provided backend controller's route
      await axios.put(`${BACKEND_URL}/api/admin/orders/${orderToUpdate}`, { status: newStatusForUpdate }, {
        withCredentials: true,
      });
      fetchOrders(); // Re-fetch orders to reflect the update
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError(err.response?.data?.error || 'Failed to update order status.');
    } finally {
      setLoading(false);
      setOrderToUpdate(null); // Clear pending update state
      setNewStatusForUpdate('');
    }
  };

  // Function to initiate the status update, showing the custom modal
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    // Instead of window.confirm, set state to show a custom modal
    setOrderToUpdate(orderId);
    setNewStatusForUpdate(newStatus);
    setShowConfirmModal(true);
  };

  // Helper function to get status icons
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'shipped': return <FiTruck className="text-blue-500" />;
      case 'pending':
      case 'processing': // Added processing as it's an enum value
      case 'cancelled':  // Added cancelled as it's an enum value
      default: return <FiClock className="text-yellow-500" />;
    }
  };

  // Display loading spinner if no orders have been fetched yet
  if (loading && orders.length === 0) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#E30B5D]"></div>
          <p className="ml-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Render the standalone AdminSidebar */}
      <AdminSidebar mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} />

      {/* Main content for OrderManagement */}
      <main
        className="flex-1 overflow-y-auto p-4 lg:p-8"
        onClick={() => setMobileSidebarOpen(false)} // Close sidebar on content click
      >
        <div className='flex flex-row'>
          <h2 className="text-3xl m-auto font-bold text-gray-800 mb-6">Order Management</h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-700">All Orders</h3>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-[#E30B5D]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option> {/* Added processing */}
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option> {/* Added cancelled */}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId || order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user?.name || order.user || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total ? order.total.toFixed(2) : '0.00'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-purple-100 text-purple-800' : // Added style for processing
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : // Added style for cancelled
                        'bg-yellow-100 text-yellow-800'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex flex-row justify-between items-center text-right text-sm font-medium">
                    <Link href={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <FiEye className='' size={18} />
                    </Link>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="ml-2 px-2 pr-7 py-1 z-40 border border-gray-300 rounded-md text-sm bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p className="mb-6">Are you sure you want to change order <span className="font-bold">{orderToUpdate?.slice(-6).toUpperCase()}</span> status to <span className="font-bold capitalize">{newStatusForUpdate}</span>?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdateOrderStatus}
                className="px-4 py-2 bg-[#E30B5D] text-white rounded-md hover:bg-[#c20a4e] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
