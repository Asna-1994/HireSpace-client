import axiosInstance from "../../Utils/Instance/axiosInstance";

  
export const fetchPremiumPlans = async () => {
    try {
      const response = await axiosInstance.get('/plans/all-plans');
      return response.data.data.plans;
    } catch (error: any) {
        console.log(error)
      throw new Error('Failed to fetch plans. Please try again.');
    }
  };
  

export const createPaymentIntentService = async (
    planPrice: number, 
    planDuration: number, 
    userId: string, 
    planId: string
  ) => {
    try {
      const response = await axiosInstance.post(
        '/payments/create-intent',
        { planPrice, planDuration },
        { params: { userId, planId } }
      );
      return response.data; 
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw error; 
    }
  };
  



  export const confirmPayment = async (paymentIntentId: string) => {
    try {
      const response = await axiosInstance.post('/payments/success', { paymentIntentId });
      return response.data;
    } catch (error) {
        console.log(error)
      throw new Error('Error confirming payment');
    }
  };