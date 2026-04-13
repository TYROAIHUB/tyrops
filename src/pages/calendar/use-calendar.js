import { useState, useCallback } from "react"

export function useCalendar(initialEvents = []) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showCalendarSheet, setShowCalendarSheet] = useState(false)
  const [events] = useState(initialEvents)

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date)
    // Auto-close mobile sheet when date is selected
    setShowCalendarSheet(false)
  }, [])

  const handleNewEvent = useCallback(() => {
    setEditingEvent(null)
    setShowEventForm(true)
  }, [])

  const handleNewCalendar = useCallback(() => {
    console.log("Creating new calendar")
    // In a real app, this would open a new calendar form
  }, [])

  const handleSaveEvent = useCallback((eventData) => {
    console.log("Saving event:", eventData)
    // In a real app, this would save to a backend
    setShowEventForm(false)
    setEditingEvent(null)
  }, [])

  const handleDeleteEvent = useCallback((eventId) => {
    console.log("Deleting event:", eventId)
    // In a real app, this would delete from backend
    setShowEventForm(false)
    setEditingEvent(null)
  }, [])

  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }, [])

  return {
    // State
    selectedDate,
    showEventForm,
    editingEvent,
    showCalendarSheet,
    events,
    // Actions
    setSelectedDate,
    setShowEventForm,
    setEditingEvent,
    setShowCalendarSheet,
    handleDateSelect,
    handleNewEvent,
    handleNewCalendar,
    handleSaveEvent,
    handleDeleteEvent,
    handleEditEvent,
  }
}
