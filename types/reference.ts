export interface Region {
    Oid: string,
    RegionName: string,
    RegionCode: string,
    ShortName: string
}

export interface SubRegion {
    Oid: string,
    RegionId: string,
    SubRegionCode: string,
    SubRegionName: string
}

export interface BusinessClass {
    Oid: string,
    BusinessClassOid: string,
    BusinessClassName: string,
    BusinessClassCode: number
}