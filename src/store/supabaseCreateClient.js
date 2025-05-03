import { createClient } from "@supabase/supabase-js";

const apiUrl = "https://qmxzutndbzkpccffzoxy.supabase.co";
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Njg2MDUsImV4cCI6MjA1NTM0NDYwNX0.96QZYdqt7jyIw-w0PEcqXqwToFUAChPCJMzo641WU_k";

export const supabase = createClient(apiUrl, apiKey);
