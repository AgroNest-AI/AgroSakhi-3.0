import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Leaf } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/lib/queryClient";

// Form schema
const formSchema = z.object({
  location: z.string().min(2, { message: "Location is required" }),
  soilType: z.string().optional(),
  soilPH: z.coerce.number().min(0).max(14).optional(),
  soilMoisture: z.coerce.number().min(0).max(100).optional(),
  temperature: z.coerce.number().min(-50).max(60).optional(),
  season: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

type Recommendation = {
  cropName: string;
  variety: string;
  reason: string;
  matchPercentage: number;
};

export default function AICropRecommender() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: user?.location?.split(",")[0] || "",
      soilType: "",
      soilPH: 7,
      soilMoisture: 50,
      temperature: 25,
      season: ""
    },
  });

  // Submit handler
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add userId if available
      const payload = user ? { ...values, userId: user.id } : values;
      
      const response = await apiRequest('/api/ai/recommendations', 'POST', payload);
      if (Array.isArray(response)) {
        setRecommendations(response);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
      setError(t('Failed to generate crop recommendations. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Determine the color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
    if (percentage >= 80) return 'bg-lime-100 dark:bg-lime-900/20 text-lime-800 dark:text-lime-300';
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
    return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300';
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Leaf className="mr-2 h-5 w-5" />
          {t('AI Crop Recommender')}
        </CardTitle>
        <CardDescription>
          {t('Get personalized crop recommendations based on your local conditions')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Location')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter your location')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Soil Type')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select soil type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="clay">{t('Clay')}</SelectItem>
                        <SelectItem value="sand">{t('Sandy')}</SelectItem>
                        <SelectItem value="silt">{t('Silty')}</SelectItem>
                        <SelectItem value="loam">{t('Loam')}</SelectItem>
                        <SelectItem value="clay_loam">{t('Clay Loam')}</SelectItem>
                        <SelectItem value="sandy_loam">{t('Sandy Loam')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Current Season')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select season')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="summer">{t('Summer')}</SelectItem>
                        <SelectItem value="monsoon">{t('Monsoon')}</SelectItem>
                        <SelectItem value="winter">{t('Winter')}</SelectItem>
                        <SelectItem value="spring">{t('Spring')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="soilPH"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('Soil pH')} ({field.value})
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={14}
                      step={0.1}
                      value={[field.value || 7]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('Acidic')}</span>
                    <span>7 - {t('Neutral')}</span>
                    <span>{t('Alkaline')}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="soilMoisture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('Soil Moisture')} ({field.value}%)
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value || 50]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('Dry')}</span>
                    <span>{t('Moist')}</span>
                    <span>{t('Wet')}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('Average Temperature')} ({field.value}°C)
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={-10}
                      max={50}
                      step={1}
                      value={[field.value || 25]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('Cold')}</span>
                    <span>{t('Moderate')}</span>
                    <span>{t('Hot')}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Generating...')}
                </>
              ) : (
                t('Get Recommendations')
              )}
            </Button>
            
            {error && (
              <div className="p-3 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}
          </form>
        </Form>
        
        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-3">{t('Recommended Crops')}</h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="flex justify-between items-center p-3 border-b bg-muted/40">
                    <h4 className="font-medium">{rec.cropName}</h4>
                    <span className={`text-sm px-2 py-1 rounded-full ${getMatchColor(rec.matchPercentage)}`}>
                      {rec.matchPercentage}% {t('Match')}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">{t('Variety')}:</span> {rec.variety}
                    </p>
                    <p className="text-sm">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}