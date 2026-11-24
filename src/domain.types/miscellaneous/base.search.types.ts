export interface BaseSearchFilters {
    OrderBy?      : string;
    Order?        : 'ascending' | 'descending';
    PageIndex?    : number;
    ItemsPerPage? : number;
}

export interface BaseSearchResults {
    TotalCount     : number;
    RetrievedCount : number;
    PageIndex      : number;
    ItemsPerPage   : number;
    Order          : string;
    OrderedBy      : string;
}
