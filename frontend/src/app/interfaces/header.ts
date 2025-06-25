export interface Header {
    key: string;
    name: string;
    position: 'left' | 'right';
    action?: () => Promise<void>;
    children?: Header[];
}