import { useState, useMemo, useCallback } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
  Search,
  CircleDot,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  SlidersHorizontal,
  Settings2,
  Plus,
  LayoutList,
  LayoutGrid,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StatefulButton } from "@/components/ui/stateful-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const getStatusColor = (status) => {
  switch (status) {
    case "Active": return "text-green-600 dark:text-green-400"
    case "Pending": return "text-orange-600 dark:text-orange-400"
    case "Error": return "text-red-600 dark:text-red-400"
    case "Inactive": return "text-gray-600 dark:text-gray-400"
    default: return "text-gray-600 dark:text-gray-400"
  }
}

const getRoleColor = (role) => {
  switch (role) {
    case "Admin": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
    case "Editor": return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
    case "Author": return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20"
    case "Maintainer": return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
    case "Subscriber": return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20"
    default: return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
  }
}

const statusOptions = [
  { value: "Active", label: "Active", icon: CircleDot },
  { value: "Pending", label: "Pending", icon: Clock },
  { value: "Error", label: "Error", icon: AlertCircle },
  { value: "Inactive", label: "Inactive", icon: CheckCircle2 },
]

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500",
]

const getAvatarColor = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export function DataTable({ users, onViewUser, onEditUser, onDeleteUser, view, onViewChange, onNewUser }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [advancedFilters, setAdvancedFilters] = useState({ role: "", plan: "" })

  const advancedFilterCount = Object.values(advancedFilters).filter(Boolean).length

  const globalFilterFn = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase()
    const u = row.original
    return [u.name, u.email, u.role, u.plan, u.billing, u.status]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(search))
  }

  const statusArrayFilter = (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length === 0) return true
    return filterValue.includes(row.getValue(columnId))
  }

  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original
        const color = getAvatarColor(user.name)
        return (
          <div className="flex items-center gap-3">
            <Avatar className={`h-8 w-8 ${color}`}>
              <AvatarFallback className="text-xs font-bold text-white bg-transparent">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getRoleColor(user.role)}`}>
                  {user.role}
                </Badge>
                <span className="font-medium truncate">{user.name}</span>
              </div>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => <span className="font-medium">{row.getValue("plan")}</span>,
    },
    {
      accessorKey: "billing",
      header: "Billing",
      cell: ({ row }) => <span className="text-sm">{row.getValue("billing")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        const StatusIcon = status === "Active" ? CircleDot : status === "Pending" ? Clock : status === "Error" ? AlertCircle : CheckCircle2
        return (
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${getStatusColor(status)}`}>
            <StatusIcon className="size-4" />
            {status}
          </span>
        )
      },
      filterFn: statusArrayFilter,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onViewUser(user)}>
              <Eye className="size-4" />
              <span className="sr-only">View user</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onEditUser(user)}>
              <Pencil className="size-4" />
              <span className="sr-only">Edit user</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => onViewUser(user)}>View Details</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => onEditUser(user)}>Edit User</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => onDeleteUser(user.id)}>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ], [onViewUser, onEditUser, onDeleteUser])

  const filteredUsers = useMemo(() => users.filter((u) => {
    const af = advancedFilters
    if (af.role && u.role !== af.role) return false
    if (af.plan && u.plan !== af.plan) return false
    return true
  }), [users, advancedFilters])

  const table = useReactTable({
    data: filteredUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
  })

  const toggleStatus = useCallback((value) => {
    setSelectedStatuses((prev) => {
      const next = prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
      table.getColumn("status")?.setFilterValue(next.length ? next : undefined)
      return next
    })
  }, [table])

  const statusCounts = useMemo(() => statusOptions.map((opt) => ({
    ...opt,
    count: users.filter((u) => u.status === opt.value).length,
  })), [users])

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-9 h-8 bg-background"
          />
        </div>

        {/* Status faceted filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed cursor-pointer">
              <PlusCircle className="size-4" />
              <span>Status</span>
              {selectedStatuses.length > 0 && (
                <>
                  <div className="mx-2 h-4 w-px shrink-0 bg-border" />
                  <div className="flex gap-1">
                    {selectedStatuses.length <= 2 ? (
                      selectedStatuses.map((s) => (
                        <Badge key={s} variant="secondary" className="rounded-sm px-1.5 text-xs font-normal">{s}</Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="rounded-sm px-1.5 text-xs font-normal">
                        {selectedStatuses.length} selected
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0" align="start">
            <Command className="!h-auto">
              <CommandInput placeholder="Status..." />
              <CommandList
                style={{ maxHeight: '200px', overflowY: 'auto' }}
                onWheel={(e) => { e.stopPropagation(); e.currentTarget.scrollTop += e.deltaY }}
              >
                <CommandGroup>
                  {statusCounts.map((opt) => {
                    const selected = selectedStatuses.includes(opt.value)
                    const Icon = opt.icon
                    return (
                      <CommandItem key={opt.value} onSelect={() => toggleStatus(opt.value)} className="cursor-pointer">
                        <div className={`flex size-4 items-center justify-center rounded-sm border ${selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
                          {selected && <CheckCircle2 className="size-3" />}
                        </div>
                        <Icon className="size-4 text-muted-foreground" />
                        <span>{opt.label}</span>
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground">{opt.count}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {selectedStatuses.length > 0 && (
                  <>
                    <Separator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => { setSelectedStatuses([]); table.getColumn("status")?.setFilterValue(undefined) }}
                        className="justify-center text-center cursor-pointer"
                      >Clear filters</CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Advanced Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed cursor-pointer">
              <SlidersHorizontal className="size-4" />
              <span>Filters</span>
              {advancedFilterCount > 0 && (
                <>
                  <div className="mx-2 h-4 w-px shrink-0 bg-border" />
                  <Badge variant="secondary" className="rounded-sm px-1.5 text-xs font-normal">{advancedFilterCount}</Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Advanced Filters</h4>
                {advancedFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs cursor-pointer"
                    onClick={() => setAdvancedFilters({ role: "", plan: "" })}>
                    <X className="size-3 mr-1" />Clear
                  </Button>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <Select value={advancedFilters.role || ""} onValueChange={(v) => setAdvancedFilters((f) => ({ ...f, role: v === "all" ? "" : v }))}>
                  <SelectTrigger className="h-8 cursor-pointer"><SelectValue placeholder="All Roles" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Author">Author</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Maintainer">Maintainer</SelectItem>
                    <SelectItem value="Subscriber">Subscriber</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Plan</label>
                <Select value={advancedFilters.plan || ""} onValueChange={(v) => setAdvancedFilters((f) => ({ ...f, plan: v === "all" ? "" : v }))}>
                  <SelectTrigger className="h-8 cursor-pointer"><SelectValue placeholder="All Plans" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer h-8">
                <Settings2 className="size-4" />View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <div className="px-2 py-1.5 text-sm font-medium">Toggle columns</div>
              <DropdownMenuSeparator />
              {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >{column.id}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {onViewChange && (
            <ToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v)} variant="outline" spacing={0}>
              <ToggleGroupItem value="list" aria-label="List view" className="cursor-pointer h-8"><LayoutList className="size-4" /></ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Card view" className="cursor-pointer h-8"><LayoutGrid className="size-4" /></ToggleGroupItem>
            </ToggleGroup>
          )}
          {onNewUser && (
            <StatefulButton className="h-8 gap-1.5 px-3 text-sm" onClick={onNewUser}>
              <Plus className="size-4" />New User
            </StatefulButton>
          )}
        </div>
      </div>

      {/* Table */}
      {view !== "card" && (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Pagination */}
      {view !== "card" && (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">Show</Label>
          <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className="w-20 cursor-pointer" id="page-size"><SelectValue /></SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50].map((s) => (<SelectItem key={s} value={`${s}`}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="hidden sm:flex items-center space-x-2">
            <p className="text-sm font-medium">Page</p>
            <strong className="text-sm">{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="cursor-pointer">Previous</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="cursor-pointer">Next</Button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
