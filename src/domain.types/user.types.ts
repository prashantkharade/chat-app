import { BaseSearchFilters, BaseSearchResults } from './miscellaneous/base.search.types';
import { ChatResponseDto } from './chat.types';

export interface UserCreateModel {
    Name : string;
}

export interface UserResponseDto {
    id        : number;
    Name      : string;
    CreatedAt : Date;
    UpdatedAt : Date;
}

export interface UserSearchFilters extends BaseSearchFilters {
    name? : string;
}

export interface UserSearchResults extends BaseSearchResults {
    Items : UserResponseDto[];
}

export interface UserChatsResponseDto {
    UserId : number;
    Chats  : ChatResponseDto[];
}
