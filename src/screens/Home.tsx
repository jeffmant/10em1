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
  { id: '1', title: 'Fiz o Boot', description: 'Hoje é dia de TTT', icon: '🧍‍♂️', checked: true },
  { id: '2', title: 'Li a Palavra', description: 'Manual do Usuário', icon: '📖', checked: false },
  { id: '3', title: 'Fiz exercício físico', description: 'Seu corpo precisa obedecer', icon: '🏋️‍♂️', checked: false },
  { id: '4', title: 'Tomei banho natural', description: 'É só hoje!', icon: '🚿', checked: true },
  { id: '5', title: 'Li o livro da semana', description: 'Pronto para a modelagem?', icon: '📚', checked: true },
  { id: '6', title: 'Trasbordei', description: 'Ensinar é aprendizado exponencial', icon: '📢', checked: false },
]

export function Home () {
  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState('')
  const [exercises, setExercises] = useState(EXERCISES)

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