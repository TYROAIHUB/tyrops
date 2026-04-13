import { useRef, useState, useEffect } from "react"
import { useT } from "@/i18n"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import useStore from "@/store/useStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  Trash2,
  Plus,
  ExternalLink,
  X,
  Variable,
  Lock,
  Link as LinkIcon,
} from "lucide-react"
import { TypeIcon } from "./type-icon"

const TYPE_META = {
  variable: { icon: Variable, color: "text-sky-600 dark:text-sky-400" },
  secret:   { icon: Lock,     color: "text-rose-600 dark:text-rose-400" },
  link:     { icon: LinkIcon, color: "text-emerald-600 dark:text-emerald-400" },
}

function TypeBadge({ type }) {
  const t = useT()
  const meta = TYPE_META[type] ?? TYPE_META.variable
  const Icon = meta.icon
  const labelKey =
    type === "secret" ? "vars.typeSecret" : type === "link" ? "vars.typeLink" : "vars.typeVariable"
  return (
    <Badge variant="outline" className={`gap-1 font-medium ${meta.color}`}>
      <Icon className="size-2.5" />
      {t(labelKey)}
    </Badge>
  )
}

function VariableRow({ item, onEdit, onDelete }) {
  const t = useT()
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const isSecret = item.type === "secret"
  const isLink = item.type === "link"
  const displayValue = isSecret && !revealed ? "••••••••••••" : item.value

  const copy = () => {
    navigator.clipboard.writeText(item.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2 group hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2">
        <code className="font-mono text-xs font-semibold text-foreground truncate flex-1">
          {item.name}
        </code>
        <TypeBadge type={item.type} />
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(item)}
            title={t("vars.edit")}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => onDelete(item.id)}
            title={t("vars.delete")}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex-1 min-w-0 font-mono text-xs bg-muted/50 rounded px-2 py-1.5 truncate">
          {isLink && revealed !== false ? (
            <a
              href={item.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {item.value}
              <ExternalLink className="size-3" />
            </a>
          ) : (
            displayValue
          )}
        </div>
        {isSecret && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setRevealed((v) => !v)}
            title={revealed ? t("vars.hide") : t("vars.show")}
          >
            {revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={copy}
          title={t("vars.copy")}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      {item.description && (
        <p className="text-[11px] text-muted-foreground">{item.description}</p>
      )}
    </div>
  )
}

function VariableForm({ initial, onSubmit, onCancel }) {
  const t = useT()
  const [name, setName] = useState(initial?.name ?? "")
  const [value, setValue] = useState(initial?.value ?? "")
  const [type, setType] = useState(initial?.type ?? "variable")
  const [description, setDescription] = useState(initial?.description ?? "")

  const canSave = name.trim().length > 0 && value.trim().length > 0

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Input
          autoFocus
          placeholder={t("vars.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-mono"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="cursor-pointer w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="variable">
              <span className="inline-flex items-center gap-1.5">
                <Variable className="size-3" />
                {t("vars.typeVariable")}
              </span>
            </SelectItem>
            <SelectItem value="secret">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-3" />
                {t("vars.typeSecret")}
              </span>
            </SelectItem>
            <SelectItem value="link">
              <span className="inline-flex items-center gap-1.5">
                <LinkIcon className="size-3" />
                {t("vars.typeLink")}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input
        placeholder={t("vars.valuePlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type === "secret" ? "password" : "text"}
        className="font-mono"
      />
      <Input
        placeholder={t("vars.descPlaceholder")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          {t("vars.cancel")}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!canSave}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              value: value.trim(),
              type,
              description: description.trim(),
            })
          }
        >
          {t("vars.save")}
        </Button>
      </div>
    </div>
  )
}

export function ProjectVariablesSheet({ open, onOpenChange, project }) {
  const t = useT()
  const updateProject = useStore((s) => s.updateProject)
  const scrollRef = useRef(null)
  const showFade = useScrollFade(scrollRef)

  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!open) {
      setEditingId(null)
      setAdding(false)
    }
  }, [open])

  if (!project) return null

  const variables = project.variables ?? []

  const persist = (next) => {
    updateProject(project.id, { variables: next })
  }

  const handleAdd = (data) => {
    persist([...variables, { id: crypto.randomUUID(), ...data }])
    setAdding(false)
  }

  const handleUpdate = (id, data) => {
    persist(variables.map((v) => (v.id === id ? { ...v, ...data } : v)))
    setEditingId(null)
  }

  const handleDelete = (id) => {
    persist(variables.filter((v) => v.id !== id))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="data-[side=right]:sm:max-w-xl w-full p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-3.5 pr-12 border-b shrink-0 flex-row items-center gap-3 space-y-0 bg-gradient-to-b from-primary/5 to-background">
          <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <TypeIcon type={project.type} size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-sm font-semibold truncate">
              {project.name}
            </SheetTitle>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <KeyRound className="size-3" />
              {t("vars.title")}
            </p>
            <SheetDescription className="sr-only">{t("vars.subtitle")}</SheetDescription>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {variables.length}
          </Badge>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-4 pb-8">
            <div className="space-y-3">
              {/* Add new (inline form) */}
              {adding ? (
                <VariableForm
                  onSubmit={handleAdd}
                  onCancel={() => setAdding(false)}
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2 border-dashed"
                  onClick={() => {
                    setAdding(true)
                    setEditingId(null)
                  }}
                >
                  <Plus className="size-4" />
                  {t("vars.add")}
                </Button>
              )}

              {/* List */}
              {variables.length === 0 && !adding ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                  {t("vars.empty")}
                </div>
              ) : (
                variables.map((item) =>
                  editingId === item.id ? (
                    <VariableForm
                      key={item.id}
                      initial={item}
                      onSubmit={(data) => handleUpdate(item.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <VariableRow
                      key={item.id}
                      item={item}
                      onEdit={(it) => {
                        setEditingId(it.id)
                        setAdding(false)
                      }}
                      onDelete={handleDelete}
                    />
                  )
                )
              )}
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200"
            style={{ opacity: showFade ? 1 : 0 }}
          />
        </div>

        <SheetFooter className="px-6 py-3 border-t shrink-0 flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
            {t("vars.cancel")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
