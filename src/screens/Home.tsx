import { Box, Center, FlatList, Spinner, Text, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useEffect, useState } from "react";
import { Daily } from "@components/Daily";
import { Task, TaskCard } from "@components/TaskCard";
import { startOfWeek, endOfWeek, getDate, format, addDays, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { DEFAULT_CHALLENGE } from '../data/challenge-template'
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { supabase } from "@utils/supabase";
import uuid from 'react-native-uuid';
import { Platform } from "react-native";
import { useUser } from '@realm/react'

type Day = {
  numberDay: string
  weekDay: string 
  date: Date
}

type TaskLog = {
  logId: string
  id: string
  checked: boolean
  date: string
}

export function Home () {
  const user = useUser()
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

      const { data: userChallenges } = await supabase.from('user_challenges').select().eq('clerk_user_id', user?.id)

      const taskIsAlreadyChecked = userChallenges?.[0]?.checked_tasks
        .find((taskLog: TaskLog) => 
          taskLog.id === foundTask.id && 
          taskLog.date === format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })
        )

      if (taskIsAlreadyChecked && !foundTask.checked) {
        const filteredCheckedTasks = userChallenges?.[0]?.checked_tasks
          .filter((taskLog: TaskLog) => 
            taskLog.logId !== taskIsAlreadyChecked.logId
          )

        await supabase
          .from('user_challenges')
          .update({ 
            checked_tasks: filteredCheckedTasks
          })
          .eq('clerk_user_id', user?.id)
      }

      if (!taskIsAlreadyChecked) {
        await supabase
          .from('user_challenges')
          .update({ 
            checked_tasks: [
              ...userChallenges?.[0]?.checked_tasks, 
              {
                logId: uuid.v4(),
                id: foundTask.id,
                checked: true,
                date: format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })
              }
            ] 
          })
          .eq('clerk_user_id', user?.id)
      }
    }
  }

  async function assignUserToChallenge() {
    const { data: createdUserChallenges } = await supabase.from('user_challenges').insert([{
      clerk_user_id: user?.id,
      challenge_id: DEFAULT_CHALLENGE
    }]).select()

    return createdUserChallenges
  }

  async function getUserChallenges() {
    setIsLoading(true)
    let { data: userChallenges } = await supabase.from('user_challenges').select().eq("clerk_user_id", user?.id)
    if (!userChallenges || userChallenges.length === 0) {
      userChallenges = await assignUserToChallenge()
    }

    let { data: foundTasks} = await supabase.from('tasks').select().eq('challenge_id', userChallenges?.[0]?.challenge_id).order('order', { ascending: true })
    if (foundTasks) {
      const weekCheckedTasks = userChallenges?.[0]?.checked_tasks
      .filter((taskLog: TaskLog) => 
        new Date(taskLog.date).getTime() >= startOfWeek(selectedDate, { locale: ptBR, weekStartsOn: 1 }).getTime() &&
        new Date(taskLog.date).getTime() <= endOfWeek(selectedDate, { locale: ptBR, weekStartsOn: 1 }).getTime()
      )
      
      foundTasks = foundTasks.map(foundTask => {
        const savedTask = weekCheckedTasks.find((taskLog: TaskLog) => taskLog.id === foundTask.id && taskLog.date === format(selectedDate, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 }))

        if(savedTask) {
          foundTask.checked = savedTask.checked ?? false
        }

        return foundTask
      })

      setTasks(foundTasks)
    }
    setIsLoading(false)
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