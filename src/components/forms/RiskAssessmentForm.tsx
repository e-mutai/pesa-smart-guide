
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Form validation schema
const riskAssessmentSchema = z.object({
  age: z.string().min(1, "Age is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  investmentGoal: z.enum(["retirement", "education", "property", "wealth", "emergency", "other"]),
  timeHorizon: z.enum(["short", "medium", "long"]),
  riskTolerance: z.number().min(1).max(10),
  existingInvestments: z.enum(["none", "some", "experienced"]),
  monthlyContribution: z.string().min(1, "Monthly contribution is required"),
});

type RiskAssessmentFormValues = z.infer<typeof riskAssessmentSchema>;

interface RiskAssessmentFormProps {
  onSubmit: (data: RiskAssessmentFormValues) => void;
}

const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ onSubmit }) => {
  const [riskLevel, setRiskLevel] = useState(5);

  const form = useForm<RiskAssessmentFormValues>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      age: "",
      monthlyIncome: "",
      investmentGoal: "wealth",
      timeHorizon: "medium",
      riskTolerance: 5,
      existingInvestments: "none",
      monthlyContribution: "",
    },
  });

  const handleSubmit = (values: RiskAssessmentFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your age" {...field} />
                </FormControl>
                <FormDescription>Your age helps us determine appropriate investment strategies.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income (KES)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your monthly income" {...field} />
                </FormControl>
                <FormDescription>Your income helps us understand your financial capacity.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="investmentGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Investment Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your investment goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="retirement">Retirement Savings</SelectItem>
                  <SelectItem value="education">Education Fund</SelectItem>
                  <SelectItem value="property">Property Purchase</SelectItem>
                  <SelectItem value="wealth">Wealth Building</SelectItem>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="other">Other Goals</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This helps us align investment recommendations with your objectives.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeHorizon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Time Horizon</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="short" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Short term (1-3 years)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="medium" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Medium term (3-7 years)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="long" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Long term (7+ years)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="riskTolerance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Tolerance (1-10)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                      setRiskLevel(vals[0]);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Conservative (1)</span>
                    <span>Balanced (5)</span>
                    <span>Aggressive (10)</span>
                  </div>
                  <div className="text-center font-medium">
                    Selected: {riskLevel} - {riskLevel <= 3 ? "Conservative" : riskLevel <= 7 ? "Balanced" : "Aggressive"}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How comfortable are you with investment volatility? Lower values indicate preference for stability.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="existingInvestments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Experience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your investment experience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No prior investments</SelectItem>
                  <SelectItem value="some">Some experience (1-3 years)</SelectItem>
                  <SelectItem value="experienced">Experienced investor (3+ years)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your familiarity with investments helps us tailor recommendations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyContribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Contribution (KES)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="How much can you invest monthly?" {...field} />
              </FormControl>
              <FormDescription>
                Regular contributions can significantly impact your investment growth.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-finance-primary hover:bg-finance-secondary">
          Generate Recommendations
        </Button>
      </form>
    </Form>
  );
};

export default RiskAssessmentForm;
