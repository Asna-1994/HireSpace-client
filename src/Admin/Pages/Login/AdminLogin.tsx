
import { toast } from 'react-toastify';
import {   useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../redux/slices/authSlice';
import * as yup from 'yup';
import Header from '../../../User/Components/Header/Header';
import { adminLogin } from '../../../services/admin/dashBoardService';


const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      'Password must contain uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
  
const result = await adminLogin(data)
      if (result.success) {
        const { token, user } = result.data;
        toast.success(result.message);
        dispatch(userLogin({ user, token }));
        navigate(`/admin/home/${user._id}`);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-3 text-2xl font-bold text-center text-gray-800">
            Admin Login
          </h2>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              {...register('email')}
              className={`rounded-sm p-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-400'
              }`}
              placeholder="Enter Email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            <input
              type="password"
              {...register('password')}
              className={`rounded-sm p-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-400'
              }`}
              placeholder="Enter Password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
