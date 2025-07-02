export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategory {

  name: string;
  userId: string | undefined
}

export interface UpdateCategory {
  name: string;
}
