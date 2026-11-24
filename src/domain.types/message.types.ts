export interface MessageCreateModel {
    ChatId   : number;
    SenderId : number;
    Text     : string;
}

export interface MessageSearchFilters {
    ChatId : number;
    Limit  : number;
}

export interface MessageReadModel {
    ChatId    : number;
    MessageId : string;
    UserId    : number;
}

export interface LastSeenUpdateModel {
    ChatId    : number;
    UserId    : number;
    MessageId : string;
}

export interface MessageResponseDto {
    id        : string;
    ChatId    : number;
    SenderId  : number;
    Text      : string;
    CreatedAt : string;
    ReadBy    : Record<string, string>;
}

export interface MessageListResponseDto {
    ChatId : number;
    Count  : number;
    Items  : MessageResponseDto[];
}

export interface MessageReadResponseDto {
    ChatId    : number;
    MessageId : string;
    UserId    : number;
    ReadAt    : string;
}

export interface LastSeenResponseDto {
    ChatId            : number;
    UserId            : number;
    LastSeenMessageId : string;
    SeenAt            : string;
}
