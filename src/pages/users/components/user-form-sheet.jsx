import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useScrollFade } from "@/hooks/use-scroll-fade"

import { Button } from "@/components/ui/button"
import { StatefulButton } from "@/components/ui/stateful-button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role: z.string().min(1, "Please select a role."),
  plan: z.string().min(1, "Please select a plan."),
  billing: z.string().min(1, "Please select a billing method."),
  status: z.string().min(1, "Please select a status."),
})

const DEFAULT_VALUES = {
  name: "",
  email: "",
  role: "",
  plan: "",
  billing: "",
  status: "Active",
}

export function UserFormSheet({ open, onOpenChange, user, onSubmit }) {
  const isEdit = !!user
  const scrollRef = useRef(null)
  const showFade = useScrollFade(scrollRef)

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        plan: user.plan || "",
        billing: user.billing || "",
        status: user.status || "Active",
      })
    } else {
      form.reset(DEFAULT_VALUES)
    }
  }, [user, form])

  const handleSubmit = (data) => {
    onSubmit(data, user?.id)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-3xl w-full p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle>{isEdit ? "Edit User" : "New User"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update user details below." : "Fill in the details to create a new user."}
          </SheetDescription>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-5 pb-8">
            <Form {...form}>
              <form id="user-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Enter full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="Enter email address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Author">Author</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Maintainer">Maintainer</SelectItem>
                            <SelectItem value="Subscriber">Subscriber</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select billing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Auto Debit">Auto Debit</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="Paypal">Paypal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Error">Error</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200"
            style={{ opacity: showFade ? 1 : 0 }}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <StatefulButton variant="outline" onClick={() => onOpenChange(false)}>Cancel</StatefulButton>
          <StatefulButton type="submit" form="user-form">
            {isEdit ? "Update User" : "Create User"}
          </StatefulButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
