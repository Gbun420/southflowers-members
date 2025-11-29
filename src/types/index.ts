import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isApproved: boolean;
  limits: {
    dailyUsed: number;
    monthlyUsed: number;
    lastReset: Timestamp;
  };
}

export interface Strain {
  id: string;
  name: string;
  thc: number;
  cbd: number;
  contrib: number;
  description: string;
  type: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number; // Stored in cents
  date: Timestamp;
  type: 'topup' | 'contribution';
  description: string;
  stripePaymentId?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  strainId: string;
  strainName: string;
  grams: number;
  contributionAmount: number; // Cost in EUR
  date: Timestamp;
  status: 'pending' | 'fulfilled' | 'cancelled';
}
