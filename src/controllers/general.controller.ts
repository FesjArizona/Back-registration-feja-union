import { catchAsync, AppError } from '../middlewares/errorHandler';
import * as generalModel from '../model/general.model'

export const getConferences = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(400, 'El campo id es necesario');
    }
    const conferenceId = parseInt(id as string, 10);
    const result = await generalModel.getConferences(conferenceId)
    return {
        code: 200,
        data: result
    };
});

export const getStates = catchAsync(async (req, res) => {
    const result = await generalModel.getStates()
    return {
        code: 200,
        data: result
    };
});

export const getShirtSizes = catchAsync(async (req, res) => {
    const result = await generalModel.getShirtSizes()
    return {
        code: 200,
        data: result
    };
});
