export interface ICardDataStats{
    title:string
    total:number
}

export interface IAreaChart{
    year:number
    name:string
    figures:number[]
}

export interface IBarChart{
    type:'week' | 'month' | 'year'
    name:string
    figures:number[]
}