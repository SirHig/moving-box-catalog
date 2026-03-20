export interface Box {
  id: string;
  boxNumber: number;
  imageUrl: string;
  aiDescription: string;
  customLabel?: string;
  room?: string;
  isFragile: boolean;
  isPriority: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BoxInput = Omit<Box, 'id' | 'createdAt' | 'updatedAt'>;
