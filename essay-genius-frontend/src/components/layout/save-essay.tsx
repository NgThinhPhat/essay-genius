import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { useState } from "react";
import { EssaySaveRequestSchema } from "@/constracts/essay.constract";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SaveEssay({ saveData: saveData }: { saveData: EssaySaveRequestSchema }) {
  const [saveType, setSaveType] = useState<string>("private");

  const mutation = useMutation({
    mutationFn: (data: EssaySaveRequestSchema) => {
      return api.essay.saveEssay({ body: data });
    },
    onSuccess: async (response) => {
      switch (response.status) {
        case 201:
          toast.success(response.body.message);
          window.location.reload();
          break;
        default:
          toast.error("Save failed");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!saveData || !saveData.essayTaskTwoScoreResponse || typeof saveData.essayTaskTwoScoreResponse.result === "string") return null;

  const handleSave = () => {
    saveData.visibility = saveType;
    mutation.mutate(saveData);
  }

  return (
    <div className="pt-4 border-t">
      <div className="space-y-4">
        <h3 className="font-medium">Save Your Essay</h3>
        <RadioGroup
          defaultValue="private"
          value={saveType}
          onValueChange={setSaveType}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" className="h-4 w-4 rounded-full border border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
            <Label htmlFor="private">Private</Label>

          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="public"
              id="public"
              disabled={saveData.essayTaskTwoScoreResponse.result.overallBand < 5}
              className="h-4 w-4 rounded-full border border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 disabled:opacity-50"
            />
            <Label
              htmlFor="public"
              className={saveData.essayTaskTwoScoreResponse.result.overallBand < 5 ? "text-muted-foreground" : ""}
            >
              Public
            </Label>
          </div>
        </RadioGroup>
        {saveData.essayTaskTwoScoreResponse.result.overallBand < 5 && (
          <p className="text-xs text-muted-foreground">
            Essays with a band score below 5 cannot be shared publicly.
          </p>
        )}
        <Button onClick={handleSave} className="w-full">Save Essay</Button>
      </div>
    </div>);
}

