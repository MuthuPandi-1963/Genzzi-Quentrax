"use client"

import React from 'react'
import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-client.provider'
import { AuthInitializer } from '@/components/auth/auth-initializer'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { Toaster } from '@/components/ui/sonner'
import { ConfirmDialogProvider } from '@/context/confirm.dialog.context'

export default function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <>
    <ThemeProvider>
        <QueryProvider>
            <AuthInitializer>
                <RoleGuard>
                  <ConfirmDialogProvider>
                {children}
                  </ConfirmDialogProvider>
                <Toaster/>
                </RoleGuard>
            </AuthInitializer>
        </QueryProvider>
    </ThemeProvider>
    </>
  )
}
