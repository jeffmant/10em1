import { Center, FlatList, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useEffect, useState } from "react";
import { Daily } from "@components/Daily";
import { TaskCard } from "@components/TaskCard";
import { startOfWeek, endOfWeek, getDate, format, addDays, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { DEFAULT_CHALLENGE, challenteTemplate } from '../data/challenge-template'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { supabase } from "@utils/supabase";
import { useUser } from "@clerk/clerk-expo";

type Day = {
  numberDay: string
  weekDay: string 
  date: Date
}

export function Home () {
  const { user } = useUser()
  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState('')
  const [tasks, setTasks] = useState(challenteTemplate.tasks)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  function handleWeekDays (date: Date) {
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
        if (+a.id < +b.id) return -1
        else if (+a.id > +b.id) return 1
        return 0
      }))
    }
  }

  async function assignUserToChallenge() {
    await supabase.from('user_challenges').insert([{
      clerk_user_id: user?.id,
      challenge_id: DEFAULT_CHALLENGE
    }])
  }

  async function getUserChallenges() {
    const { data } = await supabase.from('user_challenges').select()
    if (!data || data.length === 0) {
      assignUserToChallenge()
    }
  }

  useEffect(() => {
    if (selectedDate) {
      handleWeekDays(selectedDate)
    }
  }, [selectedDate])

  useEffect(() => {
    getUserChallenges()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />

      <Center mt={4} mr={4}>
        <DateTimePicker
          value={selectedDate} 
          locale="pt-BR"
          onChange={handleSelectDate}
          minimumDate={startOfYear(selectedDate)}
          maximumDate={endOfYear(selectedDate)}
          style={{ width: '100%' }}
        />
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
    </VStack>
  )
}