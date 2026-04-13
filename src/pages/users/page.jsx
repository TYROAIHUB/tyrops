import { useState, useEffect } from "react"
import { BaseLayout } from "@/components/layout/BaseLayout"
import useStore from "@/store/useStore"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { UserFormSheet } from "./components/user-form-sheet"
import { UserDetailSheet } from "./components/user-detail-sheet"

import initialUsersData from "./data.json"

export default function UsersPage() {
  const users = useStore((s) => s.users)
  const setUsers = useStore((s) => s.setUsers)
  const addUser = useStore((s) => s.addUser)
  const updateUser = useStore((s) => s.updateUser)
  const deleteUser = useStore((s) => s.deleteUser)

  const [view, setView] = useState("list")
  const [formOpen, setFormOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Seed users on first load if empty
  useEffect(() => {
    if (users.length === 0) {
      setUsers(initialUsersData)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const generateAvatar = (name) => {
    const names = name.split(" ")
    return names.length >= 2 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase()
  }

  const handleNewUser = () => {
    setEditUser(null)
    setFormOpen(true)
  }

  const handleEditUser = (user) => {
    setEditUser(user)
    setFormOpen(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const handleFormSubmit = (data, userId) => {
    if (userId) {
      updateUser(userId, data)
    } else {
      addUser({
        ...data,
        avatar: generateAvatar(data.name),
        joinedDate: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString().split("T")[0],
      })
    }
  }

  const handleDeleteUser = (id) => {
    deleteUser(id)
  }

  return (
    <BaseLayout>
      <div className="flex flex-col gap-4">
        <div className="px-4 lg:px-6">
          <StatCards />
        </div>

        <div className="px-4 lg:px-6 mt-4">
          <DataTable
            users={users}
            view={view}
            onViewChange={setView}
            onNewUser={handleNewUser}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>

      <UserFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editUser}
        onSubmit={handleFormSubmit}
      />

      <UserDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        user={selectedUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </BaseLayout>
  )
}
