// note.ts

// Notepad type definition for your project
export type Notepad = {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  ownerId: number;
};

// Note type definition for your project
export type Note = {
  id: number;
  title: string;
  content: string;
  notepadId: number;
  createdAt: string;
  updatedAt: string;
};

// Pagination for Notepads and Notes
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Example of a request to create or update a note or notepad
export type CreateNotepadRequest = {
  title: string;
  description: string;
  isPublic: boolean;
  ownerId: number;
};

export type UpdateNotepadRequest = {
  title?: string;
  description?: string;
  isPublic?: boolean;
};

// Example for creating a note within a notepad
export type CreateNoteRequest = {
  title: string;
  content: string;
};

export type UpdateNoteRequest = {
  title?: string;
  content?: string;
};
