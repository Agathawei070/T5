import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>; // Ou use o tipo específico dos seus dados do usuário
        }
    }
}

import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: any; // Ou defina um tipo mais específico para o usuário
  }
}

