import { useEffect, useState } from 'react';
import { Education } from '../../User/Pages/Profile/AddEducation';
import { toast } from 'react-toastify';
import {
  addOrUpdate,
  deleteEducation,
  fetchEducation,
} from '../../services/user/userProfileService';
import * as Yup from 'yup';

const useEducation = (userId: string | undefined) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Education>({
    educationName: '',
    subject: '',
    schoolOrCollege: '',
    yearOfPassing: '',
    universityOrBoard: '',
    markOrGrade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [educationId, setEducationId] = useState<string | null>(null);

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    educationName: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('Required'),
    subject: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('Required'),
    schoolOrCollege: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('Required'),
    yearOfPassing: Yup.string()
      .matches(/^\d{4}$/, 'Enter a valid 4-digit year')
      .required('Required'),
    universityOrBoard: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('Required'),
    markOrGrade: Yup.string()
      .matches(
        /^(\d{1,3}%|[A-F][+-]?)$/,
        'Enter a valid percentage (e.g., 85%) or grade (e.g., A+)'
      )
      .required('Required'),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const errorObj: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        errorObj[error.path] = error.message;
      });
      setErrors(errorObj);
      return false;
    }
  };

  const getEducations = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchEducation(userId);
      if (data.success) {
        setEducations(data.data.educations);
      }
    } catch (err: any) {
      console.error('Error fetching education data:', err);
      toast.error('Failed to fetch education data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    await addOrUpdateEducation(formValues, educationId ?? undefined);
    resetForm();
  };

  const addOrUpdateEducation = async (
    education: Education,
    educationId?: string
  ) => {
    if (!userId) return;

    try {
      const data = await addOrUpdate(education, userId, educationId);
      if (data.success) {
        toast.success(
          educationId
            ? 'Education updated successfully'
            : 'Education added successfully'
        );
        getEducations();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err);
    }
  };

  const removeEducation = async (eduId: string) => {
    if (!userId) return;

    try {
      const data = await deleteEducation(userId, eduId);
      if (data.success) {
        toast.success('Education deleted successfully');
        setEducations(data.data.educations);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error('Error deleting education');
    }
  };

  const handleEdit = (index: number, eduId: string) => {
    setFormValues(educations[index]);
    setEditIndex(index);
    setEducationId(eduId);
  };

  const resetForm = () => {
    setFormValues({
      educationName: '',
      subject: '',
      schoolOrCollege: '',
      yearOfPassing: '',
      universityOrBoard: '',
      markOrGrade: '',
    });
    setEditIndex(null);
    setEducationId(null);
    setErrors({});
  };

  useEffect(() => {
    getEducations();
  }, [userId]);

  return {
    educations,
    loading,
    formValues,
    errors,
    editIndex,
    handleChange,
    handleSubmit,
    handleEdit,
    removeEducation,
  };
};

export default useEducation;
