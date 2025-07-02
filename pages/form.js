import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const FormWithDatePicker = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      date: null, // Default date value is null
    },
  });

  const onSubmit = (data) => {};

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxWidth: 400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Name Field */}
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Name is required",
            maxLength: {
              value: 20,
              message: "Name cannot exceed 20 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
              fullWidth
            />
          )}
        />

        {/* Date Picker */}
        <Controller
          name="date"
          control={control}
          rules={{
            validate: (value) => (value ? true : "Date is required"),
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              value={field.value || null}
              onChange={(date) => field.onChange(date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Date"
                  error={!!errors.date}
                  helperText={errors.date ? errors.date.message : ""}
                  fullWidth
                />
              )}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </LocalizationProvider>
  );
};

export default FormWithDatePicker;
