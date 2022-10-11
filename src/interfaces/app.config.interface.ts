export interface IAppConfig {
    _id: string
    android:IVersion
    ios:IVersion
}

export interface IVersion {
    latestVersionCode:number
    latestVersion:string
    stableVersionCode:number
    stableVersion:string
}