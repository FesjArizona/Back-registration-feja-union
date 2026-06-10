import { catchAsync, AppError } from '../middlewares/errorHandler';
import * as eventModel from '../model/event.model' 

export const saveUserRegister = catchAsync(async (req, res) => {
    const { nombre } = req.body;
    const result = await eventModel.saveUserRegister()
    return {
        code: 200,
        data: result
    };
});
