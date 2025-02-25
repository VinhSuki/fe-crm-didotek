import { ISetting, ISettingsParams } from '@/models/interfaces/setting';
import { IApiResponse } from '@/models/interfaces/api';
import axiosPrivate from '../client/private.client';

const settingApi = {
  async fetchSettings(): Promise<IApiResponse<{setting:ISetting}>> {
    return axiosPrivate.get('Setting');
  },

  async updateSettings(params:ISettingsParams,data: FormData): Promise<IApiResponse<{setting:ISetting}>> {
    return axiosPrivate.put('Setting',data,{
      params, 
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
};

export default settingApi;
