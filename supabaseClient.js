import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  "https://gbvcdneeasdbqxetkcov.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidmNkbmVlYXNkYnF4ZXRrY292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3Mzg5NzAsImV4cCI6MjA1NjMxNDk3MH0.J1vIrlWgvzWo5WhPz2KzYtRdYRXYyOusPdIRQBP6_wI"
)