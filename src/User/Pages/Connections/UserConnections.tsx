

import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import {
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaUserFriends,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { generateRoomId } from "../../../Utils/helperFunctions/companyName";

export interface ConnectionRequest {
  _id: string;
  fromUser: {
    userName: string;
    tagLine: string;
    email: string;
    profilePhoto: {
      url: string;
      publicId: string;
    };
  };
  status: "pending" | "rejected" | "accepted";
}

export interface Connections {
  _id: string;
  userName: string;
  tagLine: string;
  email: string;
  profilePhoto: {
    url: string;
    publicId: string;
  };
}

const Connections = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [connections, setConnections] = useState<Connections[]>([]);
  const [connectionsTotalPages, setConnectionsTotalPages] = useState(1);
  const [connectionsPage, setConnectionsPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Fetch Pending Requests
  const fetchPendingRequests = async (page: number) => {
    try {
      const limit = 8;
      const response = await axiosInstance.get(
        `/connection-request/to-user/${user?._id}`,{params:{
page, limit
        }}
      );
      if (response.data.success) {
        const requests = response.data.data.pendingRequests.map(
          (request: any) => request._doc || request
        );
        console.log("request", requests)
        setPendingRequests(requests);
        setPendingTotalPages(response.data.data.totalPages);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  // Fetch Connections
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchConnections = async (page: number, search: string) => {
    setLoading(true);
    try {
      const limit = 10;
      const response = await axiosInstance.get(
        `/connection-request/user/all-connections/${user?._id}`,
        {
          params: { page, limit, search },
        }
      );
      if (response.data.success) {
        setConnections(response.data.data.connections);
        setConnectionsTotalPages(response.data.data.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred while fetching connections"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchConnections(connectionsPage, debouncedSearchTerm);
      fetchPendingRequests(pendingPage); 
    }

  }, [debouncedSearchTerm, connectionsPage,pendingPage, user?._id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRequest = async (requestId: string, action: string) => {
    try {
      const response = await axiosInstance.put(
        `/connection-request/${requestId}/${action}`
      );
      if (response.data.success) {
        fetchPendingRequests(pendingPage);
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const handleMessageButtonClick = (connection: Connections) => {
    const roomId = generateRoomId(user?._id as string, connection._id);
    navigate(`/user/messages/chats/${roomId}/${connection._id}`, {
      state: { receiver: connection },
    });
  };

  const renderPaginationControls = (
    currentPage: number,
    totalPages: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
  ) => (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
        } transition duration-300`}
      >
        <FaChevronLeft />
      </button>
      <span className="mx-2 text-gray-600">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
        } transition duration-300`}
      >
        <FaChevronRight />
      </button>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
                Network
              </h1>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/user/view-connections/${user?._id}`}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                >
                  <FaUserFriends className="text-gray-500" />
                  <span>Recommendation</span>
                </Link>
                <Link
                  to={`/user/pending-requests/${user?._id}`}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                >
                  <FaUserPlus className="text-gray-500" />
                  <span>Sent Requests</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pending Requests Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pending Requests
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    People who want to connect with you
                  </p>
                </div>

                <div className="p-6">
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map((req) => (
                        <div
                          key={req._id}
                          className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {req.fromUser.profilePhoto?.url ? (
                              <img
                                src={req.fromUser.profilePhoto.url}
                                alt={req.fromUser.userName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-500 w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {req.fromUser.userName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {req.fromUser.tagLine}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <button
                              onClick={() =>
                                handleRequest(req._id, "accept")
                              }
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleRequest(req._id, "reject")
                              }
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUserFriends className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No pending requests</p>
                    </div>
                  )}
                </div>

                {pendingRequests.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {renderPaginationControls(
                      pendingPage,
                      pendingTotalPages,
                      setPendingPage
                    )}
                  </div>
                )}
              </div>

              {/* Connections Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Your Connections
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Start making conversations
                    </p>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for people..."
                    className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-6">
                  {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                  ) : connections.length > 0 ? (
                    <div className="space-y-4">
                      {connections.map((connection) => (
                        <div
                          key={connection._id}
                          className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {connection.profilePhoto?.url ? (
                              <img
                                src={connection.profilePhoto.url}
                                alt={connection.userName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-500 w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {connection.userName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {connection.tagLine}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMessageButtonClick(connection)}
                            className="mt-2 sm:mt-0 bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition duration-300"
                          >
                            Message
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUserPlus className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No connections available</p>
                    </div>
                  )}
                </div>

                {connections.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {renderPaginationControls(
                      connectionsPage,
                      connectionsTotalPages,
                      setConnectionsPage
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Connections;
