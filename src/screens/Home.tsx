import { FlatList, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useEffect, useState } from "react";
import { Daily } from "@components/Daily";
import { TaskCard } from "@components/TaskCard";
import { startOfWeek, endOfWeek, getDate, format } from 'date-fns';
import { ptBR } from "date-fns/locale";

type Day = {
  numberDay: string
  weekDay: string 
}

const EXERCISES = [
  { id: '1', title: 'Bebi 2-4L de água', description: 'Mantenha a máquina lubrificada', checked: true },
  { id: '2', title: 'Fiz o Boot', description: 'Hoje é dia de TTT', checked: true },
  { id: '4', title: 'Li a Palavra', description: 'Provérbios 1', checked: true },
  { id: '3', title: 'Fiz exercício físico', description: 'Seu corpo precisa obedecer', checked: false },
  { id: '5', title: 'Ler livro da semana', description: 'Pai Rico, Pai Pobre', checked: true },
  { id: '6', title: 'Trasbordei', description: 'Ensinar é aprendizado exponencial', checked: false },
]

export function Home () {
  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState('')
  const [exercises, setExercises] = useState(EXERCISES)

  function handleWeekDays () {
    const date = new Date()
    const startOfWeekDate = startOfWeek(date, { locale: ptBR })
    const endOfWeekDate = endOfWeek(date, { locale: ptBR })
    
    let formatedDays = []

    for (let index = getDate(startOfWeekDate); index <= getDate(endOfWeekDate); index++) {
      const currentDate = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${index}`)

      formatedDays.push({
        numberDay: index.toString(),
        weekDay: format(currentDate, 'iiii', {
          locale: ptBR,
        }).slice(0,3).toUpperCase()
      })
    }
  
    setDays(formatedDays)
    setSelectedDay(getDate(new Date()).toString())
  }
  
  useEffect(() => {
    handleWeekDays()
  }, [])

  function handleTask (taskId: string) {
    const foundTask = exercises.find(exercise => exercise.id === taskId)

    if (foundTask) {
      foundTask.checked = !foundTask.checked

      setExercises((prev) => ([
        ...prev,
        foundTask
      ]))
    }
  }

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
          data={EXERCISES}
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