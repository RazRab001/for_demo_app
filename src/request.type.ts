import { Request } from "express"
import { ParamsDictionary } from 'express-serve-static-core';

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithParams<T> = Request<T>
export interface RequestWithFiles extends Request<ParamsDictionary> {
    files: any
}
