export const convertUtcToLocal = (utcString: string | null): string | null => {
    if(!utcString) return null;
    const date = new Date(utcString);
    return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0") + "T" +
      String(date.getHours()).padStart(2, "0") + ":" +
      String(date.getMinutes()).padStart(2, "0");
  }

  
export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
}