import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends Record<string, any>, TValue> {
    variant?: "text" | "number" | "range" | "date" | "dateRange" | "select" | "multiSelect";
    label?: string;
    placeholder?: string;
    options?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }>; count?: number }[];
    unit?: string;
  }
}
