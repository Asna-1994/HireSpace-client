import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaEnvelope,
  FaSpinner,
  FaTrashAlt,
} from 'react-icons/fa';
import CompanyHeader from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from 'framer-motion';
import Footer from '../../../User/Components/Footer/Footer';
import { addMember, getAllMembers, removeMember } from '../../../services/company/profileService';

interface Member {
  _id: string;
  userName: string;
  email: string;
  role: string;
}

const AddMembers = () => {
  const { company, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);


  // Fetching member details
  const fetchMembers = async () => {
    try {
      const data = await getAllMembers(company?._id!)
      if(data.success){
        setMembers(data.data.members);
      }
   else{
    console.log(data.message)
   }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
const  data = await addMember(company?._id!, email, role)
      if (data.success) {
        toast.success(data.message);
        setMembers([...members, data.data.newMember]);
        setEmail('');
        setRole('member');
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
       const data = await removeMember(company?._id!, memberId)
      if (data.success) {
        toast.success('Member removed successfully');
        setMembers(members.filter((member) => member._id !== memberId));
      } else {
        toast.error(data.message);
      }
    } catch (error : any) {
      toast.error(error);
    }
  };

  const isAdmin = members.some(
    (member) => member.email === user?.email && member.role === 'companyAdmin'
  );

  return (
    <>
      <CompanyHeader />

      <div className="container mx-auto p-6 min-h-screen">
        <motion.div
          className="bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg text-white rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">Manage Members</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Members Table */}
          <div className="w-full lg:w-1/2 p-4">
            <h3 className="text-xl font-bold mb-4 p-4">Existing Members</h3>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="w-full min-w-[400px] leading-normal">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-3 border-b">{member.userName}</td>
                      <td className="px-4 py-3 border-b">{member.email}</td>
                      <td className="px-4 py-3 border-b">
                        {member.role === 'companyAdmin' ? 'Admin' : 'Member'}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <button
                          onClick={() => handleRemove(member._id)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                          disabled={!isAdmin || loading}
                        >
                          <FaTrashAlt className="mr-2" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Member Form */}
          <div className="w-full lg:w-1/2 p-4">
            <h3 className="text-xl font-bold mb-4 p-4">Add New Member</h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center border-b-2 border-gray-300 mb-4">
                <FaEnvelope className="text-gray-600 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full py-2 px-3 text-gray-700 outline-none"
                  required
                />
              </div>
              <div className="flex items-center border-b-2 border-gray-300 mb-4">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full py-2 px-3 text-gray-700 outline-none"
                  required
                >
                  <option value="companyMember">Member</option>
                  <option value="companyAdmin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !isAdmin}
                className={`w-full py-3 text-white bg-blue-600 rounded-md ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  'Add Member'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddMembers;
