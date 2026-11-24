import { User } from '../models/user.entity';
import { UserResponseDto } from '../../../domain.types/user.types';

export class UserMapper {

    static toResponseDto = (user: User): UserResponseDto => {
        if (!user) {
            return null;
        }
        return {
            id        : user.id,
            Name      : user.Name,
            CreatedAt : user.CreatedAt,
            UpdatedAt : user.UpdatedAt,
        };
    };

}
