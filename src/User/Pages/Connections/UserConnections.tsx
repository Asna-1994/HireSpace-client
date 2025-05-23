import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaUserFriends,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { generateRoomId } from '../../../Utils/helperFunctions/companyName';
import { getAllConnectionFromDB, getPendingRequestFromDB, manageConnectionRequest } from '../../../services/user/requestService';

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
  status: 'pending' | 'rejected' | 'accepted';
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
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [connections, setConnections] = useState<Connections[]>([]);
  const [connectionsTotalPages, setConnectionsTotalPages] = useState(1);
  const [connectionsPage, setConnectionsPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch Pending Requests
  const fetchPendingRequests = async (page: number) => {
    try {
      const limit = 8;
      const data = await getPendingRequestFromDB(user?._id!, page, limit)
      if (data.success) {
        const requests = data.data.pendingRequests.map(
          (request: any) => request._doc || request
        );
        console.log('request', requests);
        setPendingRequests(requests);
        setPendingTotalPages(data.data.totalPages);
      } else {
        toast.error(data?.message);
      }
    } catch (error: any) {
      toast.error(error);
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
      const data = await getAllConnectionFromDB(user?._id!, page, limit, search)
      if (data.success) {
        setConnections(data.data.connections);
        setConnectionsTotalPages(data.data.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchConnections(connectionsPage, debouncedSearchTerm);
      fetchPendingRequests(pendingPage);
    }
  }, [debouncedSearchTerm, connectionsPage, pendingPage, user?._id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRequest = async (requestId: string, action: string) => {
    try {
const data = await manageConnectionRequest(requestId, action)
      if (data.success) {
        toast.success(`Request ${action}ed`)
        fetchPendingRequests(pendingPage);
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.message);
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
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
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
          currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'
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
        <main className="container px-4 py-12 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0">
                Network
              </h1>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/user/view-connections/${user?._id}`}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <FaUserFriends className="text-gray-500" />
                  <span>Recommendation</span>
                </Link>
                <Link
                  to={`/user/pending-requests/${user?._id}`}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <FaUserPlus className="text-gray-500" />
                  <span>Sent Requests</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Pending Requests Section */}
              <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pending Requests
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    People who want to connect with you
                  </p>
                </div>

                <div className="p-6">
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map((req) => (
                        <div
                          key={req._id}
                          className="flex flex-col items-center justify-between p-4 transition-colors rounded-lg sm:flex-row bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-4">
                            {req.fromUser.profilePhoto?.url ? (
                              <img
                                src={req.fromUser.profilePhoto.url}
                                alt={req.fromUser.userName}
                                className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                <FaUser className="w-5 h-5 text-blue-500" />
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
                              onClick={() => handleRequest(req._id, 'accept')}
                              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRequest(req._id, 'reject')}
                              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
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
              <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col items-start justify-between p-6 border-b border-gray-100 sm:flex-row sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Your Connections
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Start making conversations
                    </p>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for people..."
                    className="w-full px-4 py-2 border rounded-lg sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-6">
                  {loading ? (
                     <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
                  ) : connections.length > 0 ? (
                    <div className="space-y-4">
                      {connections.map((connection) => (
                        <div
                          key={connection._id}
                          className="flex flex-col items-center justify-between p-4 transition-colors rounded-lg sm:flex-row bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-4">
                            {connection.profilePhoto?.url ? (
                              <img
                                src={connection.profilePhoto.url}
                                alt={connection.userName}
                                className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                <FaUser className="w-5 h-5 text-blue-500" />
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
                            className="px-3 py-1 mt-2 text-sm text-white transition duration-300 bg-blue-500 rounded-full sm:mt-0 hover:bg-blue-600"
                          >
                            Message
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
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
