// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { IApiResponse } from '@/models/interfaces/api'
import { IAreaChart, IBarChart, ICardDataStats } from '@/models/interfaces/dashboard'
import axiosPrivate from '../client/private.client'



const dashboardApi = {
  cards():Promise<IApiResponse<ICardDataStats[]>>{
    return axiosPrivate.get('Dashboard/Cards')
  },
  areaChart(year:number):Promise<IApiResponse<IAreaChart>>{
    return axiosPrivate.get('Dashboard/Revenue/' + year)
  },
  barChart(type:'week' | 'month' | 'year'):Promise<IApiResponse<IBarChart>>{
    return axiosPrivate.get('Dashboard/Purchase/' + type)
  },
}

export default dashboardApi
