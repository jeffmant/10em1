import { FlatList, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useEffect, useState } from "react";
import { Daily } from "@components/Daily";
import { TaskCard } from "@components/TaskCard";
import { startOfWeek, endOfWeek, getDate, format } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { challenteTemplate } from '../data/challenge-template'
import { useUser } from "@clerk/clerk-expo";

type Day = {
  numberDay: string
  weekDay: string 
}

export function Home () {
  const { user } = useUser()
  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState('')
  const [tasks, setTasks] = useState(challenteTemplate.tasks)

  function handleWeekDays () {
    const date = new Date()
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1, locale: ptBR })
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1, locale: ptBR })
    
    let formatedDays = []

    for (let index = getDate(startOfWeekDate); index <= getDate(endOfWeekDate); index++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), index)

      formatedDays.push({
        numberDay: index.toString(),
        weekDay: format(currentDate, 'iiii', {
          locale: ptBR,
          weekStartsOn: 1
        }).slice(0,3).toUpperCase()
      })
    }
  
    setDays(formatedDays)
    setSelectedDay(getDate(new Date()).toString())
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
        if(+a.id < +b.id) return -1
        else if (+a.id > +b.id) return 1
        return 0
      }))
    }
  }

  useEffect(() => {
    handleWeekDays()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={days}
        keyExtractor={item => item.numberDay}
        renderItem={({ item }) => (
          <Daily
            numberDay={item.numberDay}
            weekDay={item.weekDay}
            isActive={selectedDay === item.numberDay} 
            onPress={() => setSelectedDay(item.numberDay)}
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