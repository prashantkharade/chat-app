export interface ChatCreateModel {
    UserAId : number;
    UserBId : number;
}

export interface ChatResponseDto {
    id        : number;
    MemberIds : number[];
    CreatedAt : Date;
}

export interface ChatCreateResultDto {
    Chat    : ChatResponseDto;
    Created : boolean;
}
