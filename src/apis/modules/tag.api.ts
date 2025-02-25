// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars

import { IApiResponse } from '@/models/interfaces/api'
import { ITag } from '@/models/interfaces/product'
import axiosPrivate from '../client/private.client'

const tagApi = {
  list(): Promise<IApiResponse<{tags:ITag[]}>> {
    try {
      return axiosPrivate.get('Tag')
    } catch (error) {
      throw error
    }
  },
}

export default tagApi
