export interface HookCategory {
  id: string;
  name: string;
  count: number;
  category_type: string;
  icon?: string; // optional icon for UI
}

export interface Hook {
  id: number;
  category: string;
  category_type: string;
  hook_number: number;
  author: string;
  title: string;
  explanation: string; // Bullet points separated by " | "
  template: string;
  created_at: string;
  updated_at: string;
}
