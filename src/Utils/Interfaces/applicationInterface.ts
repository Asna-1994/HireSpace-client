import { ImageObject } from "./interface";

export interface Application{
    _id?: string;
    appliedDate : Date;
    coverLetter:{
      body: string;
      closing: string;
      salutation: string;
    }
    jobPostId : {
      _id: string;
      applicationDeadline: Date;
      companyId : {
        _id:string;
        address: string;
        companyLogo : ImageObject;
        companyName: string;
        email: string;
        industry: string;
        phone:string;
      }
  benefits:[];
  createdAt: Date;
  description:string;
  educationRequired: string;
  employmentStartDate: Date ;
  experienceLevel: string;
  isBlocked: boolean;
  isDeleted: boolean;
  jobTitle: string;
  jobType: string;
  location:
   { city: string, state: string, country: string }
  numberOfVacancies: number;
  postedBy: string;
  responsibilities: []
  salaryRange:  { min: string, max:string, currency: string }
  skillsRequired: []
  status: string;
    }
    createdAt: Date;
    isDeleted : boolean;
    resumeUrl: string; 
    status: 'pending'| 'reviewed'| 'accepted'| 'rejected';
  updatedAt: Date;
  updatedDate: Date;
  userId : {
    _id : string;
    userName : string;
    profilePhoto : ImageObject;
  address: string;
  email: string;
  phone:string;
  }
  }