import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import { FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../../../Utils/helperFunctions/companyName';
import { User } from '../../../Utils/Interfaces/interface';
import { Connections } from './UserConnections';
import { fetchUsersFromDb, getRecommendationFromDB, sendConnectionRequest } from '../../../services/user/requestService';


const AllConnections = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Connections[]>([]);
  const [recommendationsPage, setRecommendationsPage] = useState(1);
  const [recommendationsTotalPages, setRecommendationsTotalPages] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const limit = 6;
  const navigate = useNavigate();

  // Fetch Recommendations
  const fetchRecommendations = async (page: number) => {
    try {
const data = await getRecommendationFromDB(user?._id!, page , limit)
      if (data.success) {
        const connectedUserIds = new Set(user?.connections);
        const filteredRecommendations =
          data.data.recommendations.filter(
            (recommendation: Connections) =>
              !connectedUserIds.has(recommendation._id)
          );
        setRecommendations(filteredRecommendations);
        setRecommendationsTotalPages(data.data.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  // Fetch Users (Search)
  const fetchUsers = async (query: string, page: number) => {
    setLoading(true);
    try {

      const data = await fetchUsersFromDb(query, page, limit)
      if (data.success) {
        setSearchResult(data.data.users);
        console.log('user search result', data.data.users);
        setSearchTotalPages(data.data.totalPages);
      } else {
        setSearchResult([]);
      }
    } catch (error: any) {
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Connect Request
  const handleSendRequestForConnection = async (
    sender: string,
    receiver: string
  ) => {
    try {
const data = await sendConnectionRequest(sender, receiver)
      if (data.success) {
        toast.success('Request has been sent');
      } else {
        toast.error(data.message);
        console.log(data)
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSearchPage(1); // Reset to first page on new search
    if (!value) {
      setSearchResult([]);
      setSearchTotalPages(1);
    }
  };

  // Debounced Search with Pagination
  useEffect(() => {
    if (!searchTerm) return; // Avoid API calls when search is empty

    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchTerm, searchPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchPage]);

  useEffect(() => {
    fetchRecommendations(recommendationsPage);
  }, [recommendationsPage]);

  const handleMessageButtonClick = (connection: Connections) => {
    const roomId = generateRoomId(user?._id as string, connection._id);
    navigate(`/user/messages/chats/${roomId}/${connection._id}`, {
      state: { receiver: connection },
    });
  };

  return (
    <>
      <Header />
      <section className="min-h-screen py-12 bg-gray-50 sm:py-16">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-center text-gray-800 sm:text-4xl">
            People You May Know
          </h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Recommendations Section */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                {recommendations.length > 0 ? (
                  recommendations
                    .filter((result) => result._id !== user?._id)
                    .map((recommendation) => (
                      <div
                        key={recommendation._id}
                        className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md sm:p-6 sm:flex-row"
                      >
                        {recommendation.profilePhoto?.url ? (
                          <img
                            src={recommendation.profilePhoto.url}
                            alt="User"
                            className="w-16 h-16 mb-4 mr-0 rounded-full sm:mr-4 sm:mb-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 mb-4 mr-0 bg-gray-200 rounded-full sm:mr-4 sm:mb-0">
                            <FaUser className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {recommendation.userName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {recommendation.email}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleSendRequestForConnection(
                              user?._id as string,
                              recommendation._id
                            )
                          }
                          className="px-4 py-2 mt-2 text-sm text-white transition duration-300 bg-blue-500 rounded-full sm:mt-0 hover:bg-blue-600"
                        >
                          Connect
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-gray-500">
                    No recommendations available.
                  </p>
                )}
              </div>
              {/* Recommendations Pagination */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() =>
                    setRecommendationsPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={recommendationsPage === 1}
                  className="px-3 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setRecommendationsPage((prev) => prev + 1)}
                  disabled={recommendationsPage === recommendationsTotalPages}
                  className="px-3 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Search Section */}
            <div>
              <div className="mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search for people..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
                <h2 className="mb-4 text-lg font-bold">Search Results</h2>
                {loading ? (
                      <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
                ) : searchResult.filter((result) => result._id !== user?._id)
                    .length > 0 ? (
                  searchResult
                    .filter((result) => result._id !== user?._id)
                    .map((result) => (
                      <div
                        key={result._id}
                        className="flex flex-col items-center mb-4 sm:flex-row"
                      >
                        {result.profilePhoto?.url ? (
                          <img
                            src={result.profilePhoto.url}
                            alt="User"
                            className="w-12 h-12 mb-2 mr-0 rounded-full sm:mr-4 sm:mb-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 mb-2 mr-0 bg-gray-200 rounded-full sm:mr-4 sm:mb-0">
                            <FaUser className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{result.userName}</h3>
                          <p className="text-sm text-gray-500">
                            {result.email}
                          </p>
                        </div>
                        {user?.connections.includes(result._id) ? (
                          <button
                            onClick={() =>
                              handleMessageButtonClick(result as Connections)
                            }
                            className="px-4 py-2 mt-2 text-sm text-white bg-green-500 rounded-full sm:mt-0 hover:bg-green-600"
                          >
                            Message
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleSendRequestForConnection(
                                user?._id as string,
                                result._id
                              )
                            }
                            className="px-4 py-2 mt-2 text-sm text-white bg-blue-500 rounded-full sm:mt-0 hover:bg-blue-600"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    ))
                ) : (
                  <p className="text-center text-gray-500">No results found.</p>
                )}
                {/* Search Pagination */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() =>
                      setSearchPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={searchPage === 1}
                    className="px-3 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setSearchPage((prev) => prev + 1)}
                    disabled={searchPage === searchTotalPages}
                    className="px-3 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AllConnections;
