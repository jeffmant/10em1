import { TaskCardProps } from "@components/TaskCard";

export function sortTasks (tasks: TaskCardProps[], orderBy: string): TaskCardProps[] {
  return tasks.sort((a, b) => {
    if (+a[orderBy] < +b[orderBy]) return -1
    else if (+a[orderBy] > +b[orderBy]) return 1
    return 0
  }) 
}