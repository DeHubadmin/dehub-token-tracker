
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface HistoricalPriceData {
  date: Date;
  price: number;
}

export async function fetchHistoricalPriceData(): Promise<HistoricalPriceData[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('historical-price', {
      method: 'GET'
    });
    
    if (error) {
      console.error("Error invoking historical-price function:", error);
      toast.error("Failed to fetch historical price data");
      return null;
    }
    
    // Convert string dates back to Date objects
    const formattedData = data.map((item: any) => ({
      date: new Date(item.date),
      price: item.price
    }));
    
    return formattedData as HistoricalPriceData[];
  } catch (error) {
    console.error("Failed to fetch historical price data:", error);
    toast.error("Failed to fetch historical price data");
    return null;
  }
}
