import { Controller } from "react-hook-form";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export const SelectField = ({
  name,
  label,
  control,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  control: any;
  options: { value: string; label: string }[];
  placeholder: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-xs font-medium text-muted-foreground">
      {label}
    </Label>

    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </>
      )}
    />
  </div>
);
