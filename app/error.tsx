"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Une erreur est survenue
          </CardTitle>
          <CardDescription>{error.message || "Une erreur inattendue s'est produite"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset} variant="outline" className="w-full bg-transparent">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
