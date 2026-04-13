import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { BaseLayout } from "@/components/layout/BaseLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import useStore from "@/store/useStore"
import { useT } from "@/i18n"

const pricingSchema = z.object({
  hourlyRate: z.coerce.number().min(0),
})

export default function PricingSettings() {
  const t = useT()
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)

  const form = useForm({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      hourlyRate: settings?.hourlyRate ?? 0,
    },
  })

  function onSubmit(data) {
    updateSettings(data)
    toast.success(
      useStore.getState().language === "TR"
        ? "Ayarlar kaydedildi."
        : "Settings saved."
    )
    form.reset(data)
  }

  const isTR = useStore((s) => s.language) === "TR"

  return (
    <BaseLayout>
      <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">{t("nav.settings.pricing")}</h1>
          <p className="text-muted-foreground">
            {isTR
              ? "Proje KPI'larında kullanılan finansal parametreler."
              : "Financial parameters used in project KPI calculations."}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isTR ? "Saatlik Ücret" : "Hourly Rate"}
                </CardTitle>
                <CardDescription>
                  {isTR
                    ? "Kazanılan zamanın parasal karşılığını hesaplamak için kullanılır. Genellikle ülkenizin asgari ücretinin saatlik karşılığı girilir."
                    : "Used to calculate the monetary value of saved time. Typically the hourly equivalent of your country's minimum wage."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isTR ? "Saat Başına Ücret" : "Rate per Hour"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative max-w-xs">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-6"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {isTR
                          ? "Örn: 3.50 ($/saat). Bu değer Detail ekranındaki \"Saat Değeri\" KPI'ı hesaplamasında kullanılır."
                          : "Ex: 3.50 ($/hour). This value is used in the \"Time Value\" KPI in the Detail view."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button type="submit" className="cursor-pointer">
                {isTR ? "Kaydet" : "Save"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={() =>
                  form.reset({ hourlyRate: settings?.hourlyRate ?? 0 })
                }
              >
                {isTR ? "İptal" : "Cancel"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </BaseLayout>
  )
}
