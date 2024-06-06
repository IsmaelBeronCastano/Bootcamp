import { RootStackParamList } from "../navigator/Navigator";

export interface MenuItem{
    name: string,
    icon: string,
    component: keyof RootStackParamList
}
