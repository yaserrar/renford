import { FilterFn } from "@tanstack/react-table";

export const numberFilterFn: FilterFn<any> = (
  row,
  columnId,
  value: [string | undefined, string | undefined]
) => {
  const originalValue = row.getValue(columnId) as number;
  const value1 = value[0];
  const value2 = value[1];
  const values = [value1 ? parseInt(value1) : 0, value2 ? parseInt(value2) : 0];

  if (value === undefined) {
    return false;
  } else {
    if (values[0] && !values[1]) {
      return originalValue >= values[0];
    }
    if (!values[0] && values[1]) {
      return originalValue <= values[1];
    }

    if (values[0] && values[1]) {
      return originalValue >= values[0] && originalValue <= values[1];
    }

    return true;
  }
};

export const selectFilterFn: FilterFn<any> = (row, columnId, value) => {
  if (value === undefined || value.length === 0) {
    return false;
  } else {
    const rowValue = row.getValue(columnId);
    return rowValue === value;
  }
};

export const objectFilterFn: FilterFn<any> = (row, columnId, value) => {
  const originalValue = row.getValue(columnId);

  if (!value) {
    return false;
  } else if (originalValue && typeof originalValue === "object") {
    const values = Object.values(originalValue) as any[];
    const k = values.filter(
      (v) =>
        v &&
        typeof v === "string" &&
        v.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    return k.length > 0;
  } else {
    return false;
  }
};

export const dateFilterFn: FilterFn<any> = (
  row,
  columnId,
  value: [Date | undefined, Date | undefined]
) => {
  if (value === undefined) {
    return false;
  } else {
    const dateOriginalValue = new Date(row.getValue(columnId));

    if (value[0] && !value[1]) {
      return dateOriginalValue >= value[0];
    }

    if (!value[0] && value[1]) {
      return dateOriginalValue <= value[1];
    }

    if (value[0] && value[1]) {
      return dateOriginalValue <= value[1] && dateOriginalValue >= value[0];
    }

    return true;
  }
};
