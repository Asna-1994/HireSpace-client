import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement, Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
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
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-xl font-semibold">Payment Details</h3>
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
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-400 to-blue-500"
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
        const plansData = await fetchPremiumPlans()
        setPlans(plansData);
        console.log(plansData);
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
      <div className="container px-6 py-12 mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900">
            Upgrade to Premium
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Unlock exclusive features and accelerate your success with our
            premium plans.
          </p>
        </div>

        {/* Plans Section */}
        <div className="grid max-w-6xl gap-8 mx-auto mb-12 lg:grid-cols-3 md:grid-cols-2">
          {/* Basic Plan */}
          <div className="p-8 text-center border-2 border-blue-400 rounded-lg shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
            <h3 className="mb-2 text-xl font-bold text-gray-900">Basic Plan</h3>
            <p className="mb-6 text-gray-600">
              Your current plan with essential features for beginners.
            </p>
            <p className="mb-4 text-3xl font-bold text-gray-800">₹0</p>
            <ul className="mb-6 space-y-3 text-left text-gray-700">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✔</span> Basic job search
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✔</span> Limited
                applications
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✔</span> Email support
              </li>
            </ul>
            <button
              disabled
              className="px-6 py-2 text-gray-500 bg-gray-300 rounded-full cursor-not-allowed"
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
          <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h3>
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
