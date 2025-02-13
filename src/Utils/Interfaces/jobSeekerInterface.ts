import { ImageObject } from './interface';

export interface EducationObject {
  educationName: string;
  yearOfPassing: string;
  markOrGrade: string;
  schoolOrCollege: string;
  subject: string;
  universityOrBoard: string;
  _id?: string;
}

export interface ExperienceObject {
  company: string;
  designation: string;
  yearCompleted: string;
  dateFrom: string;
  dateTo: string;
  skillsGained: string[];
  createAt: Date;
  updatedAt: Date;
  _id: string;
}

export interface Certificates {
  certificateTitle: string;
  description?: string;
  certificateUrl?: string;
  issuer: string;
  issuedDate: string;
  createAt: Date;
  updatedAt: Date;
  _id: string;
}

export interface Skills {
  softSkills?: [];
  hardSkills?: [];
  technicalSkills?: [];
  createAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export interface JobSeekerProfile {
  userId: string;
  _id?: string;
  education?: EducationObject[];
  workExperience?: ExperienceObject[];
  certificates?: Certificates[];
  skills?: Skills;
  resume?: ImageObject;
  createdAt?: Date;
  updatedAt?: Date;
}
