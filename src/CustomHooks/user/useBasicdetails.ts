import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { validateFile } from '../../Utils/helperFunctions/fileValidation';
import { userUpdate } from '../../redux/slices/authSlice';
import {
  deleteProfilePictureFromDB,
  updateUserDetails,
  uploadProfilePictureToDB,
} from '../../services/user/basicDetailsService';

const useBasicDetails = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.profilePhoto?.url || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [form, setForm] = useState({
    userName: user?.userName || '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    phone: user?.phone || '',
    address: user?.address || '',
    userRole: user?.userRole || 'jobSeeker',
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024;

      const validationError = validateFile(file, allowedTypes, maxFileSize);

      if (validationError) {
        toast.error(validationError);
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsCropping(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await updateUserDetails(
        user?._id!,
        form.userName,
        form.dateOfBirth,
        form.phone,
        form.address,
        form.userRole
      );
      if (data.success) {
        dispatch(userUpdate(data.data.user));
        toast.success('Updated successfully');
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cropped image upload
  const handleCroppedImage = async (croppedImageUrl: string) => {
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });

      setSelectedFile(file);
      setPreviewUrl(croppedImageUrl);

      const data = await uploadProfilePictureToDB(user?._id!, file);

      if (data.success) {
        dispatch(userUpdate(data.data.user));
        toast.success('Profile photo updated successfully!');
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  // Handle profile image deletion
  const handleDeleteImage = async () => {
    try {
      const data = await deleteProfilePictureFromDB(user?._id!);
      if (data.success) {
        dispatch(userUpdate(data.data.user));
        toast.success('Deleted successfully');
        setPreviewUrl(null);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return {
    form,
    previewUrl,
    selectedFile,
    isCropping,
    isSubmitting,
    setSelectedFile,
    setIsSubmitting,
    setPreviewUrl,
    setIsCropping,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleCroppedImage,
    handleDeleteImage,
  };
};

export default useBasicDetails;
