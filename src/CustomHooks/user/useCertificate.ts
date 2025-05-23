import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CertificateObject } from '../../User/Pages/Profile/AddCertificates';
import {
  deleteCertificate,
  fetchCertificate,
  addOrUpdate,
} from '../../services/user/certificateService';
import * as yup from 'yup';

const certificateSchema = yup.object().shape({
  certificateTitle: yup.string().required('Certificate Title is required'),
  description: yup.string().optional(),
certificateUrl: yup
  .string()
  .nullable()
  .optional(),

  issuer: yup.string().required('Issuer is required'),
  issuedDate: yup
    .string()
    .matches(/^\d{2}-\d{2}-\d{4}$/, 'Date must be in DD-MM-YYYY format')
    .test('isValidDate', 'Invalid date', (value) => {
      if (!value) return false;
      const [day, month, year] = value.split('-').map(Number);
      const parsedDate = new Date(`${year}-${month}-${day}`);
      return !isNaN(parsedDate.getTime()) && parsedDate.getDate() === day;
    })
    .test('isPastOrToday', 'Issued Date cannot be in the future', (value) => {
      if (!value) return false;
      const [day, month, year] = value.split('-').map(Number);
      const parsedDate = new Date(`${year}-${month}-${day}`);
      return parsedDate.getTime() <= new Date().getTime();
    })
    .required('Issued Date is required'),
});

const useCertificate = (userId: string | undefined) => {
  const [certificates, setCertificates] = useState<CertificateObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState<CertificateObject>({
    certificateTitle: '',
    description: '',
    certificateUrl: '',
    issuer: '',
    issuedDate: '',
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  // Fetch Certificates
  const getCertificates = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchCertificate(userId);
      if (data.success) {
        setCertificates(data.data.certificates);
      }
    } catch (err: any) {
      console.error('Error fetching certificate data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add or Update Certificate
  const addOrUpdateCertificate = async () => {
    if (!userId) return;

    try {
      await certificateSchema.validate(form, { abortEarly: false });
      setErrors({});

      const data = await addOrUpdate(form, userId, certificateId ?? undefined);
      if (data.success) {
        toast.success(
          certificateId
            ? 'Certificate updated successfully'
            : 'Certificate added successfully'
        );
        resetForm();
        getCertificates();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.response?.data?.message);
      }
    }
  };

  // Delete Certificate
  const removeCertificate = async (certId: string) => {
    if (!userId) return;

    try {
      const data = await deleteCertificate(userId, certId);
      if (data.success) {
        toast.success('Deleted successfully');
        setCertificates(data.data.certificates);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Edit Certificate
  const handleEdit = (index: number, certId: string) => {
    setForm(certificates[index]);
    setEditIndex(index);
    setCertificateId(certId);
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      certificateTitle: '',
      description: '',
      certificateUrl: '',
      issuer: '',
      issuedDate: '',
    });
    setEditIndex(null);
    setCertificateId(null);
    setErrors({});
  };

  useEffect(() => {
    getCertificates();
  }, [userId]);

  return {
    certificates,
    loading,
    form,
    errors,
    editIndex,
    handleChange,
    addOrUpdateCertificate,
    removeCertificate,
    handleEdit,
    resetForm,
  };
};

export default useCertificate;
