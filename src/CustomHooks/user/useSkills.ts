import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
  getSkills,
  deleteSkill,
  addOrUpdateSkills,
} from '../../services/user/skillService';
import { Skills } from '../../Utils/Interfaces/jobSeekerInterface';

const validationSchema = Yup.object({
  softSkills: Yup.array().of(
    Yup.string().min(2, 'Skill must be at least 2 characters')
  ),
  hardSkills: Yup.array().of(
    Yup.string().min(2, 'Skill must be at least 2 characters')
  ),
  technicalSkills: Yup.array().of(
    Yup.string().min(2, 'Skill must be at least 2 characters')
  ),
});

export const useSkills = (userId: string | undefined) => {
  const [skills, setSkills] = useState<Skills>({
    softSkills: [],
    hardSkills: [],
    technicalSkills: [],
  });

  const [skillsList, setSkillsList] = useState<Skills>({
    softSkills: [],
    hardSkills: [],
    technicalSkills: [],
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (userId) {
      fetchSkills();
    }
  }, [userId]);

  const fetchSkills = async () => {
    if (!userId) return;

    try {
      const data = await getSkills(userId);
      if (data.success) {
        setSkillsList(data.data.skills);
      } else {
        console.log('Error in fetching skills', data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const validate = async () => {
    try {
      await validationSchema.validate(skills, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: any = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User ID is missing');
      return;
    }

    const isValid = await validate();
    if (!isValid) return;

    try {
      const res = await addOrUpdateSkills(userId, skills);
      if (res.success) {
        toast.success('Skills updated successfully');
        fetchSkills();
        resetForm();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    if (!userId) return;

    try {
      const res = await deleteSkill(userId, skillName);
      if (res.success) {
        toast.success('Skill deleted successfully');
        fetchSkills();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setSkills({
      softSkills: [],
      hardSkills: [],
      technicalSkills: [],
    });
  };

  const handleEdit = () => {
    setSkills({
      softSkills: skillsList.softSkills || [],
      hardSkills: skillsList.hardSkills || [],
      technicalSkills: skillsList.technicalSkills || [],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSkills((prevSkills) => ({
      ...prevSkills,
      [name]: value.split(','),
    }));
  };

  return {
    skills,
    skillsList,
    errors,
    handleAddOrUpdate,
    handleDeleteSkill,
    handleEdit,
    handleChange,
    fetchSkills,
  };
};
