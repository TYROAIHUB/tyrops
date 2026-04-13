import { useState, useMemo, useCallback } from "react"
import { useT } from "@/i18n"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  EllipsisVertical,
  Eye,
  KeyRound,
  Pencil,
  Trash2,
  Search,
  CircleDot,
  CheckCircle2,
  Clock,
  Plus,
  LayoutList,
  LayoutGrid,
  Settings2,
  PlusCircle,
  PauseCircle,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { getTypeConfig, HugeiconsIcon } from "@/data/type-icons"

import { Badge } from "@/components/ui/badge"
import { StatefulButton } from "@/components/ui/stateful-button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TeamAvatarGroup } from "./team-avatar-group"
import { TechIconGroup } from "./tech-icon-group"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
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

const formatCurrency = (value) => {
  if (!value) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "text-green-600 dark:text-green-400"
    case "completed":
      return "text-blue-600 dark:text-blue-400"
    case "planned":
      return "text-orange-600 dark:text-orange-400"
    case "hold":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

function ProjectTypeIcon({ type }) {
  const config = getTypeConfig(type)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="shrink-0 cursor-default">
          <HugeiconsIcon
            icon={config.icon}
            style={{ width: 20, height: 20, color: config.color }}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {config.label}
      </TooltipContent>
    </Tooltip>
  )
}

const STATUS_ICONS = {
  active: CircleDot,
  planned: Clock,
  completed: CheckCircle2,
  hold: PauseCircle,
}

const avatarColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-red-500",
]

const getAvatarColor = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export function DataTable({ projects, onViewProject, onEditProject, onDeleteProject, onOpenVariables, view, onViewChange, onNewProject }) {
  const t = useT()

  const statusOptions = useMemo(() => [
    { value: "active", label: t('status.active'), icon: STATUS_ICONS.active },
    { value: "planned", label: t('status.planned'), icon: STATUS_ICONS.planned },
    { value: "completed", label: t('status.completed'), icon: STATUS_ICONS.completed },
    { value: "hold", label: t('status.hold'), icon: STATUS_ICONS.hold },
  ], [t])

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [advancedFilters, setAdvancedFilters] = useState({
    type: "",
    tech: "",
    team: "",
    minValue: "",
    maxValue: "",
    startAfter: "",
    startBefore: "",
  })

  const advancedFilterCount = Object.values(advancedFilters).filter(Boolean).length

  const globalFilterFn = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase()
    const p = row.original
    return [
      p.name,
      p.description,
      p.type,
      p.status,
      p.repo,
      p.notes,
      ...(p.tech || p.stack || []),
      ...(p.team || []),
    ]
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
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
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
      header: t('table.colProject'),
      cell: ({ row }) => {
        const project = row.original
        const type = project.type
        return (
          <div className="flex items-center gap-3">
            <ProjectTypeIcon type={type} />
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{project.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {project.description?.slice(0, 48) || "No description"}
                {project.description?.length > 48 ? "…" : ""}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "tech",
      header: t('table.colTech'),
      cell: ({ row }) => {
        const tech = row.getValue("tech") || row.original.stack || []
        return <TechIconGroup tech={tech} />
      },
      enableSorting: false,
    },
    {
      accessorKey: "team",
      header: t('table.colTeam'),
      cell: ({ row }) => (
        <TeamAvatarGroup team={row.getValue("team") || []} />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: t('table.colStatus'),
      cell: ({ row }) => {
        const status = row.getValue("status")
        const StatusIcon = status === "active" ? CircleDot : status === "completed" ? CheckCircle2 : status === "hold" ? PauseCircle : Clock
        return (
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${getStatusColor(status)}`}>
            <StatusIcon className="size-4" />
            {status ? t(`status.${status}`) : "-"}
          </span>
        )
      },
      filterFn: statusArrayFilter,
    },
    {
      accessorKey: "valueGenerated",
      header: t('table.colValue'),
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.getValue("valueGenerated"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onViewProject(project)}
            >
              <Eye className="size-4" />
              <span className="sr-only">View project</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onEditProject(project)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit project</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <EllipsisVertical className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={() => onViewProject(project)}>
                  <Eye className="mr-2 size-4" />
                  {t('table.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => onEditProject(project)}>
                  <Pencil className="mr-2 size-4" />
                  {t('table.editProject')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onOpenVariables && onOpenVariables(project)}
                >
                  <KeyRound className="mr-2 size-4" />
                  {t('vars.menuItem')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => onDeleteProject(project.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  {t('table.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ], [onViewProject, onEditProject, onDeleteProject, onOpenVariables, t])

  const filteredProjects = useMemo(() => projects.filter((p) => {
    const af = advancedFilters
    if (af.type && p.type !== af.type) return false
    if (af.tech && !(p.tech || p.stack || []).some((t) => t.toLowerCase().includes(af.tech.toLowerCase()))) return false
    if (af.team && !(p.team || []).some((t) => t.toLowerCase().includes(af.team.toLowerCase()))) return false
    if (af.minValue && (p.valueGenerated || 0) < Number(af.minValue)) return false
    if (af.maxValue && (p.valueGenerated || 0) > Number(af.maxValue)) return false
    if (af.startAfter && p.startDate && p.startDate < af.startAfter) return false
    if (af.startBefore && p.startDate && p.startDate > af.startBefore) return false
    return true
  }), [projects, advancedFilters])

  const table = useReactTable({
    data: filteredProjects,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const toggleStatus = useCallback((value) => {
    setSelectedStatuses((prev) => {
      const next = prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
      table.getColumn("status")?.setFilterValue(next.length ? next : undefined)
      return next
    })
  }, [table])

  const statusCounts = useMemo(() => statusOptions.map((opt) => ({
    ...opt,
    count: projects.filter((p) => p.status === opt.value).length,
  })), [projects])

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        {/* Left: Search + Status */}
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('table.searchPlaceholder')}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-9 h-8 bg-background"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed cursor-pointer">
              <PlusCircle className="size-4" />
              <span>{t('table.status')}</span>
              {selectedStatuses.length > 0 && (
                <>
                  <div className="mx-2 h-4 w-px shrink-0 bg-border" />
                  <div className="flex gap-1">
                    {selectedStatuses.length <= 2 ? (
                      selectedStatuses.map((s) => (
                        <Badge key={s} variant="secondary" className="rounded-sm px-1.5 text-xs font-normal">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="rounded-sm px-1.5 text-xs font-normal">
                        {selectedStatuses.length} {t('table.selected')}
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0" align="start">
            <Command className="!h-auto">
              <CommandInput placeholder={t('table.status') + "..."} />
              <CommandList
                style={{ maxHeight: '200px', overflowY: 'auto' }}
                onWheel={(e) => { e.stopPropagation(); e.currentTarget.scrollTop += e.deltaY }}
              >
                <CommandGroup>
                  {statusCounts.map((opt) => {
                    const selected = selectedStatuses.includes(opt.value)
                    const Icon = opt.icon
                    return (
                      <CommandItem
                        key={opt.value}
                        onSelect={() => toggleStatus(opt.value)}
                        className="cursor-pointer"
                      >
                        <div className={`flex size-4 items-center justify-center rounded-sm border ${selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
                          {selected && <CheckCircle2 className="size-3" />}
                        </div>
                        <Icon className="size-4 text-muted-foreground" />
                        <span>{opt.label}</span>
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                          {opt.count}
                        </span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {selectedStatuses.length > 0 && (
                  <>
                    <Separator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSelectedStatuses([])
                          table.getColumn("status")?.setFilterValue(undefined)
                        }}
                        className="justify-center text-center cursor-pointer"
                      >
                        {t('table.clearFilters')}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Advanced Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed cursor-pointer">
              <SlidersHorizontal className="size-4" />
              <span>{t('table.filters')}</span>
              {advancedFilterCount > 0 && (
                <>
                  <div className="mx-2 h-4 w-px shrink-0 bg-border" />
                  <Badge variant="secondary" className="rounded-sm px-1.5 text-xs font-normal">
                    {advancedFilterCount}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{t('table.advancedFilters')}</h4>
                {advancedFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs cursor-pointer"
                    onClick={() => setAdvancedFilters({ type: "", tech: "", team: "", minValue: "", maxValue: "", startAfter: "", startBefore: "" })}
                  >
                    <X className="size-3 mr-1" />
                    {t('table.clear')}
                  </Button>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('table.type')}</label>
                <Select
                  value={advancedFilters.type || ""}
                  onValueChange={(v) => setAdvancedFilters((f) => ({ ...f, type: v === "all" ? "" : v }))}
                >
                  <SelectTrigger className="h-8 cursor-pointer">
                    <SelectValue placeholder={t('table.allTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('table.allTypes')}</SelectItem>
                    <SelectItem value="web-app">{t('type.web-app')}</SelectItem>
                    <SelectItem value="mobile-app">{t('type.mobile-app')}</SelectItem>
                    <SelectItem value="api">{t('type.api')}</SelectItem>
                    <SelectItem value="automation">{t('type.automation')}</SelectItem>
                    <SelectItem value="agent">{t('type.agent')}</SelectItem>
                    <SelectItem value="mcp">{t('type.mcp')}</SelectItem>
                    <SelectItem value="data-pipeline">{t('type.data-pipeline')}</SelectItem>
                    <SelectItem value="other">{t('type.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('table.tech')}</label>
                <Input
                  placeholder={t('table.techPlaceholder')}
                  value={advancedFilters.tech}
                  onChange={(e) => setAdvancedFilters((f) => ({ ...f, tech: e.target.value }))}
                  className="h-8 bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('table.teamMember')}</label>
                <Input
                  placeholder={t('table.teamPlaceholder')}
                  value={advancedFilters.team}
                  onChange={(e) => setAdvancedFilters((f) => ({ ...f, team: e.target.value }))}
                  className="h-8 bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('table.valueGenerated')}</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={t('table.min')}
                    value={advancedFilters.minValue}
                    onChange={(e) => setAdvancedFilters((f) => ({ ...f, minValue: e.target.value }))}
                    className="h-8 bg-background"
                  />
                  <span className="text-xs text-muted-foreground">—</span>
                  <Input
                    type="number"
                    placeholder={t('table.max')}
                    value={advancedFilters.maxValue}
                    onChange={(e) => setAdvancedFilters((f) => ({ ...f, maxValue: e.target.value }))}
                    className="h-8 bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('table.startDateRange')}</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={advancedFilters.startAfter}
                    onChange={(e) => setAdvancedFilters((f) => ({ ...f, startAfter: e.target.value }))}
                    className="h-8 bg-background"
                  />
                  <span className="text-xs text-muted-foreground">—</span>
                  <Input
                    type="date"
                    value={advancedFilters.startBefore}
                    onChange={(e) => setAdvancedFilters((f) => ({ ...f, startBefore: e.target.value }))}
                    className="h-8 bg-background"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Right: Columns, Toggle, New */}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer h-8">
                <Settings2 className="size-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <div className="px-2 py-1.5 text-sm font-medium">{t('table.toggleColumns')}</div>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "valueGenerated" ? "Value" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {onViewChange && (
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && onViewChange(v)}
              variant="outline"
              spacing={0}
            >
              <ToggleGroupItem value="list" aria-label="List view" className="cursor-pointer h-8">
                <LayoutList className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Card view" className="cursor-pointer h-8">
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          {onNewProject && (
            <StatefulButton className="h-8 gap-1.5 px-3 text-sm" onClick={onNewProject}>
              <Plus className="size-4" />
              {t('action.newProject')}
            </StatefulButton>
          )}
        </div>
      </div>

      {view !== "card" && (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('projects.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {view !== "card" && (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            {t('table.show')}
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20 cursor-pointer" id="page-size">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} {t('table.rows')}.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="hidden sm:flex items-center space-x-2">
            <p className="text-sm font-medium">{t('table.page')}</p>
            <strong className="text-sm">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              {t('table.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              {t('table.next')}
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
