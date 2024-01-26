import { Center, FlatList, Spinner, Text, VStack } from "native-base";
import { TaskCard, TaskCardProps } from "./TaskCard";
import { useRealm, useQuery } from "@libs/realm";
import { useEffect, useState } from "react";
import { UserChallenge } from "@libs/realm/schemas/UserChallenge.schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Task } from "@libs/realm/schemas/Task.schema";
import { sortTasks } from "@utils/sort-tasks.util";
import { TaskLog } from "@libs/realm/schemas/TaskLog.schema";
import { Log } from "@libs/realm/schemas/Log.schema";

export type TaskListProps = {
  selectedDate: Date
  userChallenge: UserChallenge
}

export function TaskList ({ selectedDate, userChallenge }: TaskListProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<TaskCardProps[]>([])
  
  const realm = useRealm()

  const taskCollection = useQuery(Task)

  async function handleTask (taskId: string) {
    const foundTask = tasks.find(task => task.id === taskId)

    if (foundTask) {
      foundTask.checked = !foundTask.checked
      
      const filteredTasks = tasks.filter(task => task.id !== taskId)
      
      setTasks(sortTasks([ ...filteredTasks, foundTask ], 'order'))

      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })

      if(!userChallenge.tasksLogs || userChallenge.tasksLogs.length === 0) {
        realm.write(() => {
          const createdLog = realm.create(Log.name, Log.generate({
            checked: foundTask.checked,
            taskId: foundTask.id
          }))

          const createdTaskLog = realm.create(TaskLog.name, TaskLog.generate({
            date: formattedSelectedDate,
            logs: [createdLog as Log]
          }))

          realm.create(UserChallenge.name, UserChallenge.generate({
            id: userChallenge._id,
            userId: userChallenge.userId,
            challengeId: userChallenge.challengeId,
            tasksLogs: [createdTaskLog as TaskLog]
          }), "modified" as any)

        })
      }

      const selectedDateTasksLogs = userChallenge.tasksLogs?.find(taskLog => taskLog.date === formattedSelectedDate)

      realm.write(() => {
        const logIsAlreadyCreated = selectedDateTasksLogs?.logs?.find(log => log.taskId === foundTask.id)

        const createdLog = realm.create(Log.name, Log.generate({
          id: logIsAlreadyCreated?._id,
          taskId: foundTask.id,
          checked: foundTask.checked
        }), 'modified' as any)

        const createdTaskLog = realm.create(TaskLog.name, TaskLog.generate({
          id: selectedDateTasksLogs?._id,
          date: formattedSelectedDate,
          logs: [
            ...(selectedDateTasksLogs?.logs?.filter(log => log.taskId !== foundTask.id) || []) ,
            createdLog as Log
          ]
        }), 'modified' as any)

        realm.create(UserChallenge.name, UserChallenge.generate({
          id: userChallenge._id,
          challengeId: userChallenge.challengeId,
          userId: userChallenge.userId,
          tasksLogs: [
            ...(userChallenge.tasksLogs?.filter(taskLog => taskLog.date !== formattedSelectedDate) || []),
            createdTaskLog as TaskLog
          ]
        }), "modified" as any)

      })
    }
  }

  async function fetchChallengeTasks(userChallenge: UserChallenge) {
    try {
      setIsLoading(true)

      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })

      const foundTasksLogs = userChallenge.tasksLogs?.find(taskLog => taskLog.date === formattedSelectedDate)

      const foundChallengeTasks = taskCollection.filtered('challengeId = $0', userChallenge.challengeId) as unknown as Task[]
  
      if (foundChallengeTasks) {
        const formattedTasks: TaskCardProps[] = foundChallengeTasks.map((challengeTask: Task) => { 
          const taskLog = foundTasksLogs?.logs.find(log => log.taskId === challengeTask._id)
  
          return {
            id: challengeTask._id,
            title: challengeTask.title,
            description: challengeTask.description,
            icon: challengeTask.icon,
            order: challengeTask.order,
            checked: taskLog?.checked || false,
            date: foundTasksLogs?.date
          }
        })
  
        setTasks(sortTasks(formattedTasks, 'order'))
      }
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userChallenge) {
      fetchChallengeTasks(userChallenge)
    }
  }, [userChallenge, selectedDate])

  return (
    isLoading ? <Spinner /> : (
      <VStack flex={1} px={4}>
        <FlatList 
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskCard data={item} handleTask={handleTask} />
          )}
          ListEmptyComponent={(
            <Center>
              <Text
                fontFamily="heading"
                fontSize="xl"
              >
                Nenhuma tarefa
              </Text>
            </Center>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 32, paddingTop: 2 }}
        />
      </VStack>
    )
  )
}