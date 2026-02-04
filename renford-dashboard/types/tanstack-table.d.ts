export type Meta =
  | {
      type: null | "number" | "string" | "date";
    }
  | {
      type: "select";
      options: { label: string; value: string | number | boolean }[];
    };

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    dataType?: Meta;
  }
}
