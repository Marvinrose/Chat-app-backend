import type { Request, Response } from 'express';
export declare const createRoom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const joinRoom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserRooms: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=roomController.d.ts.map