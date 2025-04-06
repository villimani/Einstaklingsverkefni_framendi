import {
  Notepad,
  Note,
  CreateNotepadRequest,
  UpdateNotepadRequest,
  CreateNoteRequest,
  UpdateNoteRequest,
} from "@/types/note";

// Generic API fetch helper
export async function apiFetch<T>(
  url: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const message = errorData?.error || "Request failed";
    throw new Error(message);
  }

  return res.json();
}

// === Notepads ===

export async function getNotepads(token: string): Promise<Notepad[]> {
  const data = await apiFetch<{ data: Notepad[] }>(
    "/api/notepads",
    token
  );
  return data.data || [];
}

export async function getNotepadById(token: string, notepadId: number): Promise<Notepad> {
  try {
    const data = await apiFetch<{ data: Notepad }>(`/api/notepads/${notepadId}`, token);
    return data.data;
  } catch (error) {
    console.error('Error fetching notepad:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to load notepad data: ${error.message}`);
    } else {
      throw new Error('Failed to load notepad data');
    }
  }
}


export async function createNotepad(token: string, notepadData: CreateNotepadRequest): Promise<Notepad> {
  const data = await apiFetch<{ data: Notepad }>(
    "/api/notepads",
    token,
    {
      method: "POST",
      body: JSON.stringify(notepadData),
    }
  );
  return data.data;
}

export async function updateNotepad(token: string, notepadId: number, notepadData: UpdateNotepadRequest): Promise<Notepad> {
  const data = await apiFetch<{ data: Notepad }>(
    `/api/notepads/${notepadId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(notepadData),
    }
  );
  return data.data;
}

export async function deleteNotepad(token: string, notepadId: number): Promise<void> {
  await apiFetch<void>(
    `/api/notepads/${notepadId}`,
    token,
    {
      method: "DELETE",
    }
  );
}

// === Notes ===

export async function getNotesByNotepadId(token: string, notepadId: number): Promise<Note[]> {
  const data = await apiFetch<{ data: Note[] }>(
    `/api/notepads/${notepadId}/notes`,
    token
  );
  return data.data || [];
}

export async function getNoteById(token: string, noteId: number): Promise<Note> {
  if (!token) throw new Error('Missing authentication token');
  if (!noteId || isNaN(noteId)) throw new Error('Invalid note ID');

  try {
    const data = await apiFetch<{ data: Note }>(`/api/notes/${noteId}`, token);
    
    // Log the full response
    console.log(`Fetched note with ID ${noteId}:`, data);
    
    return data.data;
    
  } catch (error) {
    console.error(`Error fetching note with ID ${noteId}:`, error);
    throw new Error('Failed to fetch note');
  }
}




export async function createNote(token: string, notepadId: number, noteData: CreateNoteRequest): Promise<Note> {
  const data = await apiFetch<{ data: Note }>(
    `/api/notepads/${notepadId}/notes`,
    token,
    {
      method: "POST",
      body: JSON.stringify(noteData),
    }
  );
  return data.data;
}

export async function updateNote(token: string, notepadId: number, noteId: number, noteData: UpdateNoteRequest): Promise<Note> {
  const data = await apiFetch<{ data: Note }>(
    `/api/notepads/${notepadId}/notes/${noteId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(noteData),
    }
  );
  return data.data;
}

export async function deleteNote(token: string, notepadId: number, noteId: number): Promise<void> {
  await apiFetch<void>(
    `/api/notepads/${notepadId}/notes/${noteId}`,
    token,
    {
      method: "DELETE",
    }
  );
}

// === Initial Data ===

export async function getInitialData(token: string): Promise<{
  notepads: Notepad[];
  notes: Note[];
}> {
  const notepads = await getNotepads(token);
  const firstNotepadId = notepads[0]?.id;

  let notes: Note[] = [];

  if (firstNotepadId) {
    notes = await getNotesByNotepadId(token, firstNotepadId);
  }

  return { notepads, notes };
}
