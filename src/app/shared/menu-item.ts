import { Upload } from './upload';

export interface MenuItem {
    id?: string
    category: string
    name: string
    description?: string
    img?: Upload
    order: number;
}
