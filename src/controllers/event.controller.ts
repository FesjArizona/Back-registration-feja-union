import { UserDataRegister } from '../interfaces/register.interface';
import { catchAsync, AppError } from '../middlewares/errorHandler';
import * as eventModel from '../model/event.model'

export const getEvents = catchAsync(async (req, res) => {
    const result = await eventModel.getEvents()
    return {
        code: 200,
        data: result
    };
});

export const getEventById = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(400, 'El campo id es necesario');
    }
    const eventId = parseInt(id as string, 10);
    const result = await eventModel.getEventById(eventId)
    return {
        code: 200,
        data: result[0]
    };
});



export const saveUserRegister = catchAsync(async (req, res) => {
    const eventId = parseInt(req.params.id as string, 10);
    const data = req.body as UserDataRegister;
    data.pago_camiseta = data.talla_camiseta_id ? 'pendiente' : 'no_aplica';
    data.pago_lunchtime = data.incluir_lunchtime ? 'pendiente' : 'no_aplica';
    const result = await eventModel.saveUserRegister(data, eventId)
    return {
        code: 200,
        data: result
    };
});
