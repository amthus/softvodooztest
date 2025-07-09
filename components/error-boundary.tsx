"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                ⚠️ Une erreur est survenue
              </CardTitle>
              <CardDescription>{this.state.error?.message || "Erreur inattendue"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => this.setState({ hasError: false })} variant="outline" className="w-full">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )
      )
    }

    return this.props.children
  }
}
