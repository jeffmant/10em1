import { Box, Center, FlatList, Spinner, Text, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useEffect, useState } from "react";
import { Daily } from "@components/Daily";
import { Task, TaskCard } from "@components/TaskCard";
import { startOfWeek, endOfWeek, getDate, format, addDays, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from "date-fns/locale";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform } from "react-native";
import { useUser } from '@realm/react'
import { useRealm, useQuery } from '@libs/realm'
import { UserChallenge } from "@libs/realm/schemas/UserChallenge.schema";
import { Task as TaskRealm } from "@libs/realm/schemas/Task.schema";
import { TaskLog as TaskLogRealm } from "@libs/realm/schemas/TaskLog.schema";
import { DEFAULT_CHALLENGE } from "../data/challenge-template";

type Day = {
  numberDay: string
  weekDay: string 
  date: Date
}

export function Home () {
  const user = useUser()
  const realm = useRealm()
  const userChallengeCollection = useQuery(UserChallenge)
  const taskCollection = useQuery(TaskRealm)
  const taskLogCollection = useQuery(TaskLogRealm)

  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios' ? true : false)

  function handleAndroidDatePicker() {
    if (Platform.OS === 'android') {
      setShowDatePicker(!showDatePicker)

      DateTimePickerAndroid.open({
        value: selectedDate,
        onChange: (event, date) => handleSelectDate(event, date),
        minimumDate: startOfYear(selectedDate),
        maximumDate: endOfYear(selectedDate),
        negativeButton: { label: 'Cancelar' }
      })
    }
  }

  async function handleWeekDays (date: Date) {
    setIsLoading(true)
    let startOfWeekDate = startOfWeek(date, { locale: ptBR, weekStartsOn: 1 })
    let endOfWeekDate = endOfWeek(date, { locale: ptBR, weekStartsOn: 1 })  
    
    let formatedDays = []

    let currentDate = startOfWeekDate

    while (currentDate.getTime() <= endOfWeekDate.getTime()) {
      formatedDays.push({
        numberDay: currentDate.getDate().toString(),
        weekDay: format(currentDate, 'iiii', {
          locale: ptBR,
          weekStartsOn: 1
        }).slice(0,3).toUpperCase(),
        date: currentDate
      })

      currentDate = addDays(currentDate, 1)
    }

    setDays(formatedDays)
    setSelectedDay(getDate(date).toString())
    setIsLoading(false)
  }

  function handleSelectDate(_event: DateTimePickerEvent, date?: Date) {
    if (date) {
      setSelectedDate(date)
    }
  }

  async function handleTask (taskId: string) {
    const foundTask = tasks.find(task => task.id === taskId)

    if (foundTask) {
      foundTask.checked = !foundTask.checked
      const filteredTasks = tasks.filter(task => task.id !== taskId)
      
      setTasks([
        ...filteredTasks,
        foundTask
      ].sort((a, b) => {
        if (+a.order < +b.order) return -1
        else if (+a.order > +b.order) return 1
        return 0
      }))
    }

    const userChallenges = userChallengeCollection.filtered('userId = $0', user.id)

    const taskLogs = taskLogCollection.filtered('userChallengeId = $0', userChallenges[0]._id)

    const taskIsAlreadyChecked = taskLogs
        .find((taskLog: TaskLogRealm) => 
          taskLog._id === foundTask?.id && 
          taskLog.date === format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })
        )

    if (taskIsAlreadyChecked && !foundTask?.checked) {
      realm.write(() => {
        realm.delete(taskIsAlreadyChecked)
      })
    }

    if (!taskIsAlreadyChecked) {
      realm.write(() => {
        realm.create(TaskLogRealm.name, TaskLogRealm.generate({
          checked: true,
          date: format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 }),
          taskId: foundTask!.id,
          userChallengeId: userChallenges[0]._id
        }))
      })
    }
  }

  function assignUserToChallenge(){
    realm.write(() => {
      realm.create(UserChallenge.name, UserChallenge.generate({
        userId: user.id,
        challengeId: DEFAULT_CHALLENGE
      }))
    })

    return userChallengeCollection.filtered('userId = $0', user.id)
  }

  function getUserChallenges () {
    try {

      setIsLoading(true)
      let userChallenges = userChallengeCollection.filtered('userId = $0', user.id)
      
      if(!userChallenges || userChallenges.length === 0) {
        userChallenges = assignUserToChallenge()
      }

      let foundTasks = taskCollection.filtered('challengeId = $0', userChallenges[0].challengeId).sorted('order')
    
      if(foundTasks) {
        const dayCheckedTasks = taskLogCollection
          .filtered('userChallengeId = $0 AND date = $1', 
            userChallenges[0]._id, 
            format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })
          )
      
        const filteredTasks: Task[] = foundTasks.map(foundTask => {
          const taskLog: TaskLogRealm | undefined = dayCheckedTasks.find((taskLogRealm: TaskLogRealm) => taskLogRealm.taskId === foundTask._id)
          
          const filteredTask: Task = { 
            id: foundTask._id,
            title: foundTask.title,
            description: foundTask.description,
            icon: foundTask.icon,
            order: foundTask.order,
            checked: taskLog?.checked || false,
            date: taskLog?.date
          }

          return filteredTask
        })

        setTasks(filteredTasks)
      }
            
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }

  useEffect(() => {
    if (selectedDate) {
      handleWeekDays(selectedDate)
      getUserChallenges()
    }
  }, [selectedDate])

  return (
    <VStack flex={1}>
      <HomeHeader />

      <Center mt={4} flexDirection="row" alignContent="center">
        {
          Platform.OS === 'ios' ? (
              <DateTimePicker
                value={selectedDate} 
                locale="pt-BR"
                onChange={handleSelectDate}
                minimumDate={startOfYear(selectedDate)}
                maximumDate={endOfYear(selectedDate)}
              /> 
          ) : 
          (
            <Box px={2} py={1} bgColor="gray.300" rounded="lg">
              <Text fontFamily="body" fontWeight="normal" fontSize="lg" onPress={handleAndroidDatePicker}>
                {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </Text>
            </Box>
          )
        }
      </Center>

      <FlatList
        data={days}
        keyExtractor={item => item.numberDay}
        renderItem={({ item }) => (
          <Daily
            numberDay={item.numberDay}
            weekDay={item.weekDay}
            isActive={selectedDay === item.numberDay} 
            onPress={() => {
              setSelectedDay(item.numberDay)
              setSelectedDate(item.date)
            }}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 2 }}
        mt={4}
        maxH={24}
        minH={10}
      />

      {
        isLoading ? 
          <Spinner /> : 
          (
            <VStack flex={1} px={4}>
              <FlatList 
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TaskCard data={item} handleTask={handleTask} />
                )}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ paddingBottom: 8 }}
              />
            </VStack>
          )
      }

    </VStack>
  )
}