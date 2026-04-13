import { BaseLayout } from "@/components/layout/BaseLayout"
import { Calendar } from "./components/calendar"
import { events, eventDates } from "./data"

export default function CalendarPage() {
  return (
    <BaseLayout
      title="Calendar"
      description="Manage your schedule and events"
    >
      <div className="px-4 lg:px-6">
        <Calendar events={events} eventDates={eventDates} />
      </div>
    </BaseLayout>
  )
}
