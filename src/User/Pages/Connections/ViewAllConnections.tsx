import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { generateRoomId } from "../../../Utils/helperFunctions/companyName";
import { User } from "../../../Utils/Interfaces/interface";
import { Connections } from "./UserConnections";

const AllConnections = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      const response = await axiosInstance.get(
        `/connection-request/recommendations/${user?._id}?page=${page}&limit=${limit}`,
      );
      if (response.data.success) {
        const connectedUserIds = new Set(user?.connections);
        const filteredRecommendations =
          response.data.data.recommendations.filter(
            (recommendation: Connections) =>
              !connectedUserIds.has(recommendation._id),
          );
        setRecommendations(filteredRecommendations);
        setRecommendationsTotalPages(response.data.data.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch recommendations",
      );
    }
  };

  // Fetch Users (Search)
  const fetchUsers = async (query: string, page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/all-users`, {
        params: { search: query, page, limit, role: "jobSeeker" },
      });
      if (response.data.success) {
        setSearchResult(response.data.data.users);
        console.log("user search result", response.data.data.users);
        setSearchTotalPages(response.data.data.totalPages);
      } else {
        setSearchResult([]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Connect Request
  const handleSendRequestForConnection = async (
    sender: string,
    receiver: string,
  ) => {
    try {
      const response = await axiosInstance.post(`/connection-request`, {
        fromUser: sender,
        toUser: receiver,
      });
      if (response.data.success) {
        toast.success("Request has been sent");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send connection request",
      );
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
      <section className="bg-gray-50 py-12 sm:py-16 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
            People You May Know
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Recommendations Section */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                {recommendations.length > 0 ? (
                  recommendations
                    .filter((result) => result._id !== user?._id)
                    .map((recommendation) => (
                      <div
                        key={recommendation._id}
                        className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center"
                      >
                        {recommendation.profilePhoto?.url ? (
                          <img
                            src={recommendation.profilePhoto.url}
                            alt="User"
                            className="w-16 h-16 rounded-full mr-0 sm:mr-4 mb-4 sm:mb-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-0 sm:mr-4 mb-4 sm:mb-0">
                            <FaUser className="text-gray-500 w-8 h-8" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-gray-800 font-semibold">
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
                              recommendation._id,
                            )
                          }
                          className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition duration-300"
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
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() =>
                    setRecommendationsPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={recommendationsPage === 1}
                  className="px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setRecommendationsPage((prev) => prev + 1)}
                  disabled={recommendationsPage === recommendationsTotalPages}
                  className="px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
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
              <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-4">Search Results</h2>
                {loading ? (
                  <p className="text-center">Loading...</p>
                ) : searchResult.filter((result) => result._id !== user?._id)
                    .length > 0 ? (
                  searchResult
                    .filter((result) => result._id !== user?._id)
                    .map((result) => (
                      <div
                        key={result._id}
                        className="flex flex-col sm:flex-row items-center mb-4"
                      >
                        {result.profilePhoto?.url ? (
                          <img
                            src={result.profilePhoto.url}
                            alt="User"
                            className="w-12 h-12 rounded-full mr-0 sm:mr-4 mb-2 sm:mb-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-0 sm:mr-4 mb-2 sm:mb-0">
                            <FaUser className="text-gray-500 w-6 h-6" />
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
                            className="mt-2 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600"
                          >
                            Message
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleSendRequestForConnection(
                                user?._id as string,
                                result._id,
                              )
                            }
                            className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
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
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() =>
                      setSearchPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={searchPage === 1}
                    className="px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setSearchPage((prev) => prev + 1)}
                    disabled={searchPage === searchTotalPages}
                    className="px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
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
