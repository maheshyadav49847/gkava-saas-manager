import api from './api';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  displayOrder: number;
}

export const teamMembersService = {
  getAll: async () => {
    const response = await api.get<TeamMember[]>('/AdminTeamMembers');
    return response.data;
  },

  create: async (data: Omit<TeamMember, 'id'>) => {
    const response = await api.post<{ id: string }>('/AdminTeamMembers', data);
    return response.data;
  },

  update: async (id: string, data: TeamMember) => {
    await api.put(`/AdminTeamMembers/${id}`, data);
  },

  delete: async (id: string) => {
    await api.delete(`/AdminTeamMembers/${id}`);
  }
};
