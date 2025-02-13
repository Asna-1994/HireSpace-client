import React, { useEffect, useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { FaCheck, FaCrown } from 'react-icons/fa';
import { Plans } from '../../../Utils/Interfaces/interface';
import { toast } from 'react-toastify';
import Header from '../../Components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { userUpdate } from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

console.log('Stripe Promise:', stripePromise);
console.log('publishable key', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PricingCard: React.FC<{
  plan: Plans;
  selected: boolean;
  onSelect: (plan: Plans) => void;
}> = ({ plan, selected, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-xl shadow-lg ${
      selected
        ? 'bg-gradient-to-r from-purple-400 to-blue-500 text-white'
        : 'bg-white'
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3
        className={`text-2xl font-bold ${selected ? 'text-white' : 'text-gray-800'}`}
      >
        {plan.planType}
      </h3>
      <FaCrown
        className={`text-2xl ${selected ? 'text-white' : 'text-blue-500'}`}
      />
    </div>
    <div className="mb-6">
      <span className="text-3xl font-bold">₹{plan.price}</span>
      <span className={`${selected ? 'text-white' : 'text-gray-600'}`}>
        /{plan.durationInDays}
      </span>
    </div>
    <ul className="space-y-3 mb-6">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <FaCheck
            className={`mr-2 ${selected ? 'text-white' : 'text-green-500'}`}
          />
          <span className={selected ? 'text-white' : 'text-gray-600'}>
            {feature}
          </span>
        </li>
      ))}
    </ul>
    <button
      onClick={() => onSelect(plan)}
      className={`w-full py-3 rounded-lg font-semibold transition-all ${
        selected
          ? 'bg-white text-blue-500 hover:bg-gray-100'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {selected ? 'Selected' : 'Choose Plan'}
    </button>
  </motion.div>
);

// CheckoutForm Component
const CheckoutForm: React.FC<{ selectedPlan: Plans }> = ({ selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, company } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!stripe || !elements) {
        setError(
          'Stripe is not properly initialized. Please refresh the page.'
        );
        setLoading(false);
        return;
      }

      if (user?.isPremium) {
        toast.error('User already have a premium subscription');
        return;
      }
      const response = await axiosInstance.post(
        `/payments/create-intent`,
        {
          planPrice: selectedPlan.price,
          planDuration: selectedPlan.durationInDays,
        },
        {
          params: {
            userId: user?._id,
            planId: selectedPlan._id,
          },
        }
      );

      const clientSecret = response.data.data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('CardElement not found');
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );
      if (response.status === 409) {
        toast.error(response.data.message);
      }
      if (error) {
        console.error('Payment failed:', error.message);
        navigate(`/user/${user?._id}/payment-failed`); // Redirect to success page
      } else if (paymentIntent?.status === 'succeeded') {
        elements?.getElement(CardElement)?.clear();
        await confirmPaymentOnServer(paymentIntent.id);
      }
    } catch (err: any) {
      navigate(`/user/${user?._id}/payment-failed`);
    } finally {
      setLoading(false);
    }
  };

  const confirmPaymentOnServer = async (paymentIntentId: string) => {
    try {
      const response = await axiosInstance.post(`/payments/success`, {
        paymentIntentId,
      });
      if (response.data.success) {
        console.log('Payment confirmed on server:', response.data);
        const { updatedUser, subscription } = response.data.data;
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

// PremiumPlans Component
const PremiumPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plans | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [plans, setPlans] = useState<Plans[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get('/plans/all-plans');
        setPlans(response.data.data.plans);
        console.log(response.data.data.plans);
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
