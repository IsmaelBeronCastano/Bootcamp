import { MovementType } from "../common/enums/movement-types";

export interface MovementCreateDto{
    type: MovementType
    user_id: number
    amount: number
}


