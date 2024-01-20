import { FlatList, Spinner, VStack } from "native-base";
import { TaskCard, TaskCardProps } from "./TaskCard";
import { useRealm, useQuery } from "@libs/realm";
import { useEffect, useState } from "react";
import { UserChallenge } from "@libs/realm/schemas/UserChallenge.schema";
import { TaskLog } from "@libs/realm/schemas/TaskLog.schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Task } from "@libs/realm/schemas/Task.schema";
import { sortTasks } from "@utils/sort-tasks.util";

export type TaskListProps = {
  selectedDate: Date
  userChallenge: UserChallenge
}

export function TaskList ({ selectedDate, userChallenge }: TaskListProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<TaskCardProps[]>([])
  const [tasksLogs, setTasksLogs] = useState<TaskLog[]>([])
  
  const realm = useRealm()

  const taskCollection = useQuery(Task)
  const taskLogCollection = useQuery(TaskLog)

  async function handleTask (taskId: string) {
    const foundTask = tasks.find(task => task.id === taskId)

    if (foundTask) {
      foundTask.checked = !foundTask.checked
      const filteredTasks = tasks.filter(task => task.id !== taskId)
      
      setTasks(sortTasks([ ...filteredTasks, foundTask ], 'order'))
    }

    const taskIsAlreadyChecked = tasksLogs
        .find((taskLog: TaskLog) => 
          taskLog.taskId === foundTask?.id && 
          taskLog.date === format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })
        )

    if (taskIsAlreadyChecked) {
      realm.write(() => {
        realm.delete(taskIsAlreadyChecked)
      })
    } else {
      realm.write(() => {
        realm.create(TaskLog.name, TaskLog.generate({
          checked: true,
          date: format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 }),
          taskId: foundTask!.id,
          userChallengeId: userChallenge._id
        }))
      })
    }
  }

  async function fetchChallengeTasks(challengeId: string) {
    const fomattedSelectedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })
    const foundTasksLogs = taskLogCollection.filtered('userChallengeId = $0 AND date = $1', userChallenge._id, fomattedSelectedDate) as unknown as TaskLog[]
    setTasksLogs(foundTasksLogs)
    
    const challengeTasks = taskCollection.filtered('challengeId = $0', challengeId) as unknown as Task[]

    if (challengeTasks) {
      const formattedTasks: TaskCardProps[] = challengeTasks.map((challengeTask: Task) => { 
        const taskLog = foundTasksLogs.find(taskLog => taskLog.taskId === challengeTask._id)

        return {
          id: challengeTask._id,
          title: challengeTask.title,
          description: challengeTask.description,
          icon: challengeTask.icon,
          order: challengeTask.order,
          checked: taskLog?.checked || false,
          date: taskLog?.date
        }
      })

      setTasks(sortTasks(formattedTasks, 'order'))
    }
  }

  useEffect(() => {
    if (userChallenge?.challengeId) {
      fetchChallengeTasks(userChallenge?.challengeId)
    }
  }, [userChallenge])

  return (
    isLoading ? <Spinner /> : (
      <VStack flex={1} px={4}>
        <FlatList 
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskCard data={item} handleTask={handleTask} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 32, paddingTop: 2 }}
        />
      </VStack>
    )
  )
}