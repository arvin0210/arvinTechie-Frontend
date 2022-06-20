export interface TaskList {
    id: number;
    description: string;
    targetDate: Date;
    completed: boolean;
    highlighted?: boolean;
    user_account_id: number;
}