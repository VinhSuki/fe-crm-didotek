export interface ISetting {
  mainLogo: string
  sloganLogo: string
  slogan: string
  hotline: string
  email: string
  branchName1: string
  branchAddress1: string
  branchName2: string
  branchAddress2: string
  facebookLink: string
  instagramLink: string
  youtubeLink: string
  mainBanner: string
  subBanner1: string
  subBanner2: string
  slideshowBanner1: string
  slideshowBanner2: string
  slideshowBanner3: string
  description: string
  serviceTitle1: string
  serviceInfo1: string
  serviceTitle2: string
  serviceInfo2: string
  serviceTitle3: string
  serviceInfo3: string
  serviceTitle4: string
  serviceInfo4: string
}

export interface IBanner {
  mainBanner: string
  subBanner1: string
  subBanner2: string
}

export interface ISlideshow {
  slideshowBanner1: string
  slideshowBanner2: string
  slideshowBanner3: string
}

export interface ILogo {
  mainLogo: string
  sloganLogo: string
  slogan: string
}

export interface IAddress {
  branchName1: string
  branchAddress1: string
  branchName2: string
  branchAddress2: string
}

export interface ISocial {
  facebookLink: string
  instagramLink: string
  youtubeLink: string
}

export interface IService {
  serviceTitle1: string
  serviceInfo1: string
  serviceTitle2: string
  serviceInfo2: string
  serviceTitle3: string
  serviceInfo3: string
  serviceTitle4: string
  serviceInfo4: string
}

export interface ISettingsParams {
  slogan: string;
  hotline: string;
  email: string;
  description: string;
  branchName1: string;
  branchAddress1: string;
  branchName2: string;
  branchAddress2: string;
  facebookLink: string;
  instagramLink: string;
  youtubeLink: string;
  serviceTitle1: string;
  serviceInfo1: string;
  serviceTitle2: string;
  serviceInfo2: string;
  serviceTitle3: string;
  serviceInfo3: string;
  serviceTitle4: string;
  serviceInfo4: string;
}