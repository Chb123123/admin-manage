export interface Menus {
    id: string;
    pid?: string;
    icon?: string;
    index: string;
    title: string;
    permiss?: string;
    children?: Menus[];
}

export interface SysTemTree {
    id: Number;
    parentId?: Number;
    path: String;
    zIndex: Number;
    icon?: string;
    title: string;
    children?: SysTemTree[];
}