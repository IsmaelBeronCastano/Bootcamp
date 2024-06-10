import { ActionType } from "../action-types"

export interface RepositoriesState{
    loading: boolean
    error: string | null
    data: string[] //vamos a decir que el listado de paquetes de NPM es un array de strings
}

interface SearchRepositoriesAction{
    type: ActionType.SEARCH_REPOSITORIES
}

interface SearchRepositoriesSuccessAction{
    type: ActionType.SEARCH_REPOSITORIES_SUCCES,
    payload: string[]
}

interface SearchRepositoriesErrorAction{
    type: ActionType.SEARCH_REPOSITORIES_ERROR,
    payload: string
}

export type Action = 
    | SearchRepositoriesAction  
    | SearchRepositoriesSuccessAction  
    | SearchRepositoriesErrorAction


