import { FindManyOptions } from 'typeorm';
import { BaseSearchFilters } from '../../../domain.types/miscellaneous/base.search.types';
import { AppError } from '../../../common/error.handling/app.error';
import { ErrorHandler } from '../../../common/error.handling/error.handler';

export class BaseService {

    protected addSortingAndPagination = <T>(search: FindManyOptions<T>, filters: BaseSearchFilters) => {
        const orderByColumn = filters.OrderBy ?? 'CreatedAt';
        const order = filters.Order === 'ascending' ? 'ASC' : 'DESC';
        const limit = filters.ItemsPerPage ?? 25;
        const pageIndex = filters.PageIndex ?? 0;

        search.order = { [orderByColumn]: order } as any;
        search.take = limit;
        search.skip = pageIndex * limit;

        return { search, pageIndex, limit, order, orderByColumn };
    };

    protected rethrow(error: any, message: string): never {
        if (error instanceof AppError) {
            throw error;
        }
        ErrorHandler.throwDbAccessError(message, error);
    }

}
