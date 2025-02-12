import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import AdminHeader from "../../Components/Header/AdminHeader";
import SideBar from "../../Components/SideBar/SideBar";
import Footer from "../../../User/Components/Footer/Footer";

const EditOrCreatePlan = () => {
  const { planId } = useParams(); // Extract planId from URL
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState("");
  const [durationInDays, setDurationInDays] = useState(0);
  const [features, setFeatures] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current plan details to populate the edit form
    const fetchPlanDetails = async () => {
      try {
        const response = await axiosInstance.get(`/plans/${planId}`);
        setPlanDetails(response.data.data);
        setPlanType(response.data.data.planType);
        setDurationInDays(response.data.data.durationInDays);
        setFeatures(response.data.data.features);
      } catch (err) {
        toast.error("Failed to fetch plan details.");
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPlan = { planType, durationInDays, features };

      const response = await axiosInstance.patch(
        `/plans/edit/${planId}`,
        updatedPlan,
      );
      if (response.data.success) {
        toast.success("Plan updated successfully!");
        navigate("/admin/manage-plans"); // Redirect after update
      } else {
        setError("Failed to update plan");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to update plan.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AdminHeader />
      <div className="flex flex-col lg:flex-row h-auto bg-gray-100 min-h-screen">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow lg:ml-64 p-4 lg:p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Edit Plan</h2>
          {error && <div className="text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="planType"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Type
              </label>
              <input
                type="text"
                id="planType"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="durationInDays"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (in Days)
              </label>
              <input
                type="number"
                id="durationInDays"
                value={durationInDays}
                onChange={(e) => setDurationInDays(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="features"
                className="block text-sm font-medium text-gray-700"
              >
                Features
              </label>
              <textarea
                id="features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                rows={4}
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/manage-plans")}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditOrCreatePlan;
