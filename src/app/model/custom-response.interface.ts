import { Project } from "./kanban.model";
import { TaskList } from "./task.model";

export interface CustomResponse {
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;

    //protected Map<?, ?> data;
    data: { 
        taskLists ?: TaskList[], 
        taskList ?: TaskList,
        projects ?: Project[],
        project ?: Project,
    } 
}