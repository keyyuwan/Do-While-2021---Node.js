// "aumentando/personalizando" a tipagem do Express

declare namespace Express {
  export interface Request {
    user_id: string;
  }
}
