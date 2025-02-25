import { IContactListResponse, IContactDetailResponse } from '../interfaces/contact';
import { PAGINATION_CONFIG } from '@/constants';

export const contactListResponseData: IContactListResponse = {
  status: 200,
  data: {
    contacts: [
      {
        id: 1,
        title: 'Inquiry about services',
        message: 'I would like to know more about your services and pricing.',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        status: 1, // Active
        deleted: false, // Not deleted
        createdAt: '1734974964.4281',
      },
      {
        id: 2,
        title: 'Complaint regarding support',
        message: 'I faced an issue with the customer support team. Please resolve this.',
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '0987654321',
        status: 1, // Active
        deleted: false, // Not deleted
        createdAt: '1734974964.4281',
      },
      {
        id: 3,
        title: 'Feedback for your platform',
        message: 'Your platform is great, but I think there is room for improvement in the UI.',
        fullName: 'Alice Brown',
        email: 'alice.brown@example.com',
        phoneNumber: '1122334455',
        status: 0, // Inactive
        deleted: true, // Deleted
        createdAt: '1734974964.4281',
      },
    ],
    pagination: {
      currentPage: PAGINATION_CONFIG.DEFAULT_PAGE,
      totalPage: 2,
      totalRecords: 5,
    },
  },
  message: 'Data fetched successfully.',
};

export const contactDetailResponseData: IContactDetailResponse = {
  status: 200,
  data: {
    id: 1,
    title: 'Inquiry about services',
    message: 'I would like to know more about your services and pricing.',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    status: 1, // Active
    deleted: false, // Not deleted
    createdAt: '1734974964.4281',
  },
  message: 'Data fetched successfully.',
};

export const contactAccountsData = contactListResponseData.data.contacts.map((contact) => ({
  id: contact.id,
  email: contact.email,
  status: contact.status,
}));
