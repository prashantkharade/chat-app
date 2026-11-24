import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Source } from '../../database.connector';
import { ErrorHandler } from '../../../common/error.handling/error.handler';
import {
    UserCreateModel,
    UserResponseDto,
    UserSearchFilters,
    UserSearchResults,
} from '../../../domain.types/user.types';
import { BaseService } from './base.service';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../models/user.entity';

export class UserService extends BaseService {

    _userRepository: Repository<User> = Source.getRepository(User);

    public create = async (model: UserCreateModel): Promise<UserResponseDto> => {
        try {
            const user = this._userRepository.create({ Name: model.Name });
            const record = await this._userRepository.save(user);
            return UserMapper.toResponseDto(record);
        } catch (error) {
            this.rethrow(error, 'Unable to create user!');
        }
    };

    public getById = async (id: number): Promise<UserResponseDto> => {
        try {
            const user = await this._userRepository.findOneBy({ id });
            if (!user) {
                ErrorHandler.throwNotFoundError('User not found!');
            }
            return UserMapper.toResponseDto(user);
        } catch (error) {
            this.rethrow(error, 'Unable to get user!');
        }
    };

    public exists = async (id: number): Promise<boolean> => {
        try {
            return await this._userRepository.existsBy({ id });
        } catch (error) {
            this.rethrow(error, 'Unable to check user!');
        }
    };

    public search = async (filters: UserSearchFilters): Promise<UserSearchResults> => {
        try {
            const where = filters.name ? { Name: ILike(`%${filters.name}%`) } : {};
            const { search, pageIndex, limit, order, orderByColumn } =
                this.addSortingAndPagination<User>({ where } as FindManyOptions<User>, filters);

            const [list, count] = await this._userRepository.findAndCount(search);
            return {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map((x) => UserMapper.toResponseDto(x)),
            };
        } catch (error) {
            this.rethrow(error, 'Unable to search users!');
        }
    };

}
