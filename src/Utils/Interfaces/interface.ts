export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user?: User | TempUser;
    company?: Company | TempCompany;
  };
}

export interface ImageObject {
  url: string;
  publicId: string;
}
export interface SignupFormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  userRole: string;
}

export interface CompanyFormData {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  establishedDate: Date;
  industry: string;
  companyAdminEmail: string;
}

export interface User {
  userName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  tagLine?: string;
  entity: 'company' | 'user';
  userRole: 'jobSeeker' | 'companyAdmin' | 'companyMember' | 'admin';
  password?: string;
  _id: string;
  profilePhoto?: ImageObject;
  googleId?: string;
  appPlan: {
    planType: string;
    startDate: Date | null;
    endDate: Date | null;
    subscriptionId: string | null;
  };
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isFresher: boolean;
  isSpam: boolean;
  companyId?: string;
  connections: string[];
  savedJobs: string[];
  appliedJobs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  establishedDate?: Date;
  entity: 'company' | 'user';
  industry: string;
  companyLogo: ImageObject;
  password?: string;
  _id: string;
  appPlan: 'basic' | 'premium';
  isBlocked: boolean;
  verificationDocument: ImageObject;
  documentNumber: string;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isSpam: boolean;
  members: string[];
  admins: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TempUser {
  userName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  entity: 'company' | 'user';
  userRole: 'jobSeeker' | 'companyAdmin' | 'companyMember' | 'admin';
  password?: string;
  _id: string;
  otp: string;
  otpExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface TempCompany {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  establishedDate?: Date;
  entity: 'company' | 'user';
  industry: string;
  password?: string;
  _id: string;
  otp: string;
  otpExpiry: Date;
  companyAdminEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  roomId: string;
  status?: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

export interface Plans {
  _id?: string;
  planType: string;
  price: number;
  userType: 'user' | 'company';
  durationInDays: number;
  features: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
