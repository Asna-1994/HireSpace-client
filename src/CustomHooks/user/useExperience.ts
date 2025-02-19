import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { addOrUpdateExperienceToDB, deleteExperience, fetchExperience } from "../../services/user/experienceService";



const experienceValidationSchema = Yup.object().shape({
    company: Yup.string().required('Company name is required'),
    designation: Yup.string().required('Designation is required'),
    yearCompleted: Yup.number()
      .typeError('Year must be a valid number')
      .integer('Year must be an integer')
      .positive('Year must be a positive number')
      .required('Year completed is required'),
    dateFrom: Yup.string()
      .required('Start date is required')
      .test('is-valid-date', 'Invalid date format (DD-MM-YYYY)', (value) => {
        // Validate the date format
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(value)) return false;
  
        // Parse the date string into a Date object
        const [day, month, year] = value.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        return !isNaN(date.getTime()); // Check if the date is valid
      })
      .test('is-in-past', 'Start date must be in the past', (value) => {
        // Parse the date string into a Date object
        const [day, month, year] = value.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
        return date < today;
      })
      .test('is-before-end-date', 'Start date must be earlier than end date', function (value) {
        const { dateTo } = this.parent;
        if (!dateTo) return true; // Skip if end date is not provided
  
        // Parse the date strings into Date objects
        const [fromDay, fromMonth, fromYear] = value.split('-');
        const [toDay, toMonth, toYear] = dateTo.split('-');
        const fromDate = new Date(`${fromYear}-${fromMonth}-${fromDay}`);
        const toDate = new Date(`${toYear}-${toMonth}-${toDay}`);
  
        return fromDate < toDate;
      }),
    dateTo: Yup.string()
      .required('End date is required')
      .test('is-valid-date', 'Invalid date format (DD-MM-YYYY)', (value) => {
        // Validate the date format
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(value)) return false;
  
        // Parse the date string into a Date object
        const [day, month, year] = value.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        return !isNaN(date.getTime()); // Check if the date is valid
      }),
      skillsGained: Yup.array()
      .of(Yup.string().required('Skill cannot be empty'))
      .min(1, 'At least one skill is required')
      .notRequired(),
  });


export interface Experience {
    company: string;
    designation: string;
    yearCompleted: string;
    dateFrom: string;
    dateTo: string;
    skillsGained: string[];
    _id?: string;
  }


const useExperience = (userId: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [expId, setExpId] = useState<string | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [form, setForm] = useState<Experience>({
      company: '',
      designation: '',
      yearCompleted: '',
      dateFrom: '',
      dateTo: '',
      skillsGained: [],
    });



  

  const validateForm = async () => {
    try {
      await experienceValidationSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

    const getExperience = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await fetchExperience(userId);
            if (data.success) {
                setExperiences(data.data.experience);
            }
        } catch (err: any) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };


const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
        ...prevForm,
        [name]: name === 'skillsGained' ? value.split(',').map(skill => skill.trim()) : value,
      }));
      
  };
  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!(await validateForm())) return;
        
        if (!userId) return;
        try {
            const data = await addOrUpdateExperienceToDB(form, userId, expId ?? undefined);
            if (data.success) {
                toast.success(expId ? 'Experience updated successfully' : 'Experience added successfully');
                getExperience();
            } else {
                toast.error(data.message);
            }
        } catch (err: any) {
            toast.error(err);
        }
        resetForm();
    };



    const removeExperience = async (expId: string) => {
        if (!userId) return;

        try {
            const data = await deleteExperience(userId, expId);
            if (data.success) {
                toast.success('Education deleted successfully');
                setExperiences(data.data.experience);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error('Error deleting experience');
        }
    };

  const handleEdit = (index: number, experienceId: string) => {
    setForm(experiences[index]);
    setEditIndex(index);
    setExpId(experienceId);
  };


    const resetForm = () => {
        setForm({
            company: '',
            designation: '',
            yearCompleted: '',
            dateFrom: '',
            dateTo: '',
            skillsGained: [],
        });
        setEditIndex(null);
        setExpId(null);
        setErrors({});
    };
    

    useEffect(() => {
        getExperience();
    }, [userId]);

    return {
        experiences,
        form,
        errors,
        editIndex,
        handleChange,
        handleSubmit,
        handleEdit,
        removeExperience
    };
};

export default useExperience;
