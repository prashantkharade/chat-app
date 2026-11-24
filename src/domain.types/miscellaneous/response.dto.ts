export interface ResponseDto {
    Status   : 'success' | 'failure';
    Message  : string;
    HttpCode : number;
    Data?    : any;
    Errors?  : string[];
}
