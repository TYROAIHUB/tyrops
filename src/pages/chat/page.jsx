import { useEffect, useState } from "react"

import { BaseLayout } from "@/components/layout/BaseLayout"
import { Chat } from "./components/chat"

// Import static data
import conversationsData from "./data/conversations.json"
import messagesData from "./data/messages.json"
import usersData from "./data/users.json"

export default function ChatPage() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, these would be API calls
        setConversations(conversationsData)
        setMessages(messagesData)
        setUsers(usersData)
      } catch (error) {
        console.error("Failed to load chat data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <BaseLayout title="Chat" description="Team communication and messaging">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading chat...</div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title="Chat" description="Team communication and messaging">
      <div className="px-4 md:px-6">
        <Chat
          conversations={conversations}
          messages={messages}
          users={users}
        />
      </div>
    </BaseLayout>
  )
}
