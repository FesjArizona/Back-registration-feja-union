import { AuthRequest } from '../middlewares/auth.middleware';
import { Request, Response } from 'express';
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


export const getResumen = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(400, 'El campo id es necesario');
    }
    const eventId = parseInt(id as string, 10);
    const totalRegistrados = await generalModel.totalRegistrados(eventId)
    const totalCheckin = await generalModel.totalCheckin(eventId)
    const totalCamisaPagada = await generalModel.totalCamisaPagada(eventId)
    const totalLunchPagada = await generalModel.totalLunchPagada(eventId)
    const result = [
        { icon: "registered.svg", label: "Total Registrados", value: totalRegistrados },
        { icon: "check-ed.svg", label: "Check-in Realizados", value: totalCheckin },
        { icon: "shirts.svg", label: "Camisetas Pagadas", value: totalCamisaPagada },
        { icon: "lunch.svg", label: "Comidas pagadas", value: totalLunchPagada }
    ]
    return {
        code: 200,
        data: result
    };
});
