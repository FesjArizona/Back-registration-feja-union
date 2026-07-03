import { PayData, UserDataRegister } from '../interfaces/register.interface';
import { catchAsync, AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Request, Response } from 'express';
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
    data.pago_camiseta = data.incluir_camisa ? 'pendiente' : 'no_aplica';
    data.pago_lunchtime = data.incluir_lunchtime ? 'pendiente' : 'no_aplica';
    const result = await eventModel.saveUserRegister(data, eventId)
    return {
        code: 200,
        data: result
    };
});

export const getEventRegistrations = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(400, 'El campo id es necesario');
    }
    const eventId = parseInt(id as string, 10);
    const registrations = await eventModel.getEventRegistrations(eventId)
    return {
        code: 200,
        data: registrations
    };
});

export const getRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(400, 'El campo id es necesario');
    }
    const registerId = parseInt(id as string, 10);
    const registration = await eventModel.getRegistration(registerId)
    return {
        code: 200,
        data: registration[0]
    };
});

export const checkIn = catchAsync(async (req: AuthRequest, res: Response) => {
    const registerId = parseInt(req.params.id as string, 10);
    const adminId = req.user.id;
    await eventModel.checkIn(registerId, adminId);

    return {
        code: 200,
        data: { message: 'Check-in realizado con éxito' }
    };
});

export const updatePaymentRegister = catchAsync(async (req: AuthRequest, res: Response) => {
    const authReq = req as AuthRequest;

    const registerId = parseInt(req.params.id as string, 10);
    const adminId = authReq.user.id;
    const data = req.body as PayData;

    if (!['camiseta', 'lunchtime'].includes(data.concepto)) {
        return {
            code: 400,
            data: { message: 'Concepto de pago no válido' }
        };
    }

    await eventModel.updatePaymentRegister(registerId, adminId, data);

    return {
        code: 200,
        data: { message: `Estatus de ${data.concepto} actualizado correctamente` }
    };
});


export const removeRegister = catchAsync(async (req: AuthRequest, res: Response) => {
    const registerId = parseInt(req.params.id as string, 10);
    const registration = await eventModel.getRegistration(registerId)
    if (!registration) {
        return {
            code: 200,
            data: { message: 'Registro no encontrado' }
        };
    }
    await eventModel.removeRegister(registerId);

    return {
        code: 200,
        data: { message: 'registro eliminado' }
    };
});


export const updateRegister = catchAsync(async (req: AuthRequest, res: Response) => {
    const registerId = parseInt(req.params.id as string, 10);
    const authReq = req as AuthRequest;
    const data = req.body as any;
    const adminId = authReq.user.id;
    await eventModel.updateRegister(data, registerId, adminId)

    return {
        code: 200,
        data: { message: 'registro actualizado' }
    };
});
