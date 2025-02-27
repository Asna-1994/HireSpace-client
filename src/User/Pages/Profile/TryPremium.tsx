import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement, Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { FaCheck, FaCrown } from 'react-icons/fa';
import { Plans } from '../../../Utils/Interfaces/interface';
import { toast } from 'react-toastify';
import Header from '../../Components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { userUpdate } from '../../../redux/slices/authSlice';
import {  useNavigate } from 'react-router-dom';
import { confirmPayment, createPaymentIntentService, fetchPremiumPlans } from '../../../services/user/paymentService';
import PricingCard from './PricingCard';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

console.log('Stripe Promise:', stripePromise);
console.log('publishable key', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);



const CheckoutForm: React.FC<{ selectedPlan: Plans }> = ({ selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!stripe || !elements) {
        setError('Stripe is not properly initialized. Please refresh the page.');
        setLoading(false);
        return;
      }
  
      if (user?.isPremium) {
        toast.error('User already has a premium subscription');
        return;
      }
  
      // Call the API to create a payment intent
      const { clientSecret, message } = await createPaymentIntentService(
        selectedPlan.price, 
        selectedPlan.durationInDays, 
        user?._id as string, 
        selectedPlan._id as string
      );
  
      if (!clientSecret) {
        toast.error(message || 'Failed to create payment intent');
        return;
      }
  
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('CardElement not found');
      }
  

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );
  
      if (error) {
        console.error('Payment failed:', error.message);
        toast.error(error.message);
        navigate(`/user/${user?._id}/payment-failed`);
        return;
      }
  
      if (paymentIntent?.status === 'succeeded') {
        elements.getElement(CardElement)?.clear();
        await confirmPaymentOnServer(paymentIntent.id);
        navigate(`/user/${user?._id}/activated-premium`);
      }
    } catch (err: any) {
      console.error('Payment process error:', err);
      toast.error('An error occurred during payment');
      navigate(`/user/${user?._id}/payment-failed`);
    } finally {
      setLoading(false);
    }
  };
  

  const confirmPaymentOnServer = async (paymentIntentId: string) => {
    try {
      const data = await confirmPayment(paymentIntentId)
      if (data.success) {
        console.log('Payment confirmed on server:', data);
        const { updatedUser } = data.data;
        dispatch(userUpdate(updatedUser));

        navigate(`/user/${user?._id}/activated-premium`);
      } else {
        navigate(`/user/${user?._id}/payment-failed`);
      }
    } catch (error) {
      navigate(`/user/${user?._id}/payment-failed`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        <div className="mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
              },
            }}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-400 to-blue-500 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? 'Processing...' : `Pay $${selectedPlan.price}`}
        </motion.button>
      </div>
    </form>
  );
};


const PremiumPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plans | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [plans, setPlans] = useState<Plans[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await fetchPremiumPlans()
        setPlans(data.data.plans);
        console.log(data.data.plans);
      } catch (error: any) {
        toast.error('Failed to fetch plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (plan: Plans) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Upgrade to Premium
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive features and accelerate your success with our
            premium plans.
          </p>
        </div>

        {/* Plans Section */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Basic Plan */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-8 border-2 border-blue-400 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Plan</h3>
            <p className="text-gray-600 mb-6">
              Your current plan with essential features for beginners.
            </p>
            <p className="text-3xl font-bold text-gray-800 mb-4">₹0</p>
            <ul className="text-left text-gray-700 mb-6 space-y-3">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Basic job search
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Limited
                applications
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Email support
              </li>
            </ul>
            <button
              disabled
              className="px-6 py-2 bg-gray-300 text-gray-500 rounded-full cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plans */}
          {loading ? (
            <p className="text-center col-span-full">Loading plans...</p>
          ) : (
            plans.map((plan) => (
              <PricingCard
                key={plan._id}
                plan={plan}
                selected={selectedPlan?._id === plan._id}
                onSelect={handlePlanSelect}
              />
            ))
          )}
        </div>

        {/* Checkout Section */}
        {showCheckout && selectedPlan && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm selectedPlan={selectedPlan} />
            </Elements>
          </div>
        )}
      </div>
    </>
  );
};

export default PremiumPlans;
