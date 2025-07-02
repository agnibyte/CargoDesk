import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CustomDatePicker(props) {
  const options = { ...props };
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        views={["year", "month", "day"]}
        format="DD/MM/YYYY"
        {...options}
      />
    </LocalizationProvider>
  );
}
