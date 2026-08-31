import api from '../../services/api';

export interface ContactMessageDto {
    id: string;
    name: string;
    email: string;
    phoneCountryCode: string;
    phone: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const getContactMessages = async (): Promise<ContactMessageDto[]> => {
    const response = await api.get('/admin/contact-messages');
    return response.data as unknown as ContactMessageDto[];
};
