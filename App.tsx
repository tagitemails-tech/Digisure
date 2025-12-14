import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ListingPage from './pages/ListingPage';
import Cart from './pages/Cart';
import { ProductType } from './types';
import { CheckCircle, X } from 'lucide-react';

const CartNotification = () => {
  const { notification, closeNotification } = useCart();
  const navigate = useNavigate();

  if (!notification.show || !notification.product) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 w-80 relative overflow-hidden">
        <button 
          onClick={closeNotification}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4">
           <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
             <img src={notification.product.thumbnail} alt="" className="h-full w-full object-cover" />
           </div>
           <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 mb-1">
                <CheckCircle size={14} className="fill-current text-white dark:text-gray-800" />
                <span className="text-xs font-bold uppercase tracking-wider">Added to Cart</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-4">
                {notification.product.title}
              </h4>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                ₹{notification.product.price.toLocaleString('en-IN')}
              </p>
           </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
           <button 
             onClick={closeNotification} 
             className="px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
           >
             Keep Shopping
           </button>
           <button 
             onClick={() => { closeNotification(); navigate('/cart'); }} 
             className="px-3 py-2 text-xs font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
           >
             Checkout Now
           </button>
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  <Route 
                    path="/courses" 
                    element={
                      <ListingPage 
                        type={ProductType.COURSE} 
                        title="Online Courses" 
                        subtitle="Upgrade your skills with video courses from top instructors."
                      />
                    } 
                  />
                  
                  <Route 
                    path="/academic" 
                    element={
                      <ListingPage 
                        type={ProductType.ACADEMIC} 
                        title="Academic Resources" 
                        subtitle="Study notes, question banks, and past papers for Schools & Competitive Exams."
                      />
                    } 
                  />
                  
                  <Route 
                    path="/downloads" 
                    element={
                      <ListingPage 
                        type={ProductType.DOWNLOAD} 
                        title="Digital Downloads" 
                        subtitle="Templates, eBooks, and Software to accelerate your work."
                      />
                    } 
                  />
                </Routes>
                
                {/* Global Cart Notification Popup */}
                <CartNotification />
                
              </main>
              
              <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Digisure. Made for India with ❤️.
                  </p>
                </div>
              </footer>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;