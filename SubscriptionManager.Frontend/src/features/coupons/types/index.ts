export interface CouponDto {
  id: string;
  code: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  expiryDate: string | null;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCouponDto {
  code: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  expiryDate: string | null;
  maxUses: number | null;
  isActive: boolean;
}

export interface UpdateCouponDto {
  id: string;
  code: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  expiryDate: string | null;
  maxUses: number | null;
  isActive: boolean;
}
