import { parseISO, format } from "date-fns";

export const formatDate = (dateString: string) => {
  const newDate = parseISO(dateString);
  const formattedDate = format(newDate, "dd/MM/yyyy");
  return formattedDate;
};
