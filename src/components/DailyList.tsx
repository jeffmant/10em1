import { FlatList } from "native-base"
import { Daily } from "./Daily"
import { useEffect, useState } from "react"
import { addDays, endOfWeek, format, getDate, startOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"

type Day = {
  numberDay: string
  weekDay: string 
  date: Date
}

type DailyListProps = {
  selectedDate: Date
  handleSelectDate: (date: Date) => void
}

export function DailyList({ selectedDate, handleSelectDate }: DailyListProps) {
  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState('')

  async function handleWeekDays (date: Date) {
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

  useEffect(() => {
    if (selectedDate) {
      handleWeekDays(selectedDate)
    }
  }, [selectedDate])

  return (
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
            handleSelectDate(item.date)
          }}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      _contentContainerStyle={{ px: 4 }}
      mt={4}
      maxH={24}
      minH={10}
    />
  )
}