import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, EyeOff } from "lucide-react";

const ColumnHeader = <TData,>({
  column,
  header,
}: {
  column: Column<TData>;
  header: string;
}) => {
  return (
    <>
      {!column.getCanSort() ? (
        <div className="px-4">{header}</div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "my-1 flex items-center gap-1 px-0 rounded-md focus-visible:ring-0",
                "cursor-pointer"
              )}
            >
              {header}
              {column.getIsSorted() === "desc" && (
                <ArrowDown className="ml-1" size={15} />
              )}
              {column.getIsSorted() === "asc" && (
                <ArrowUp className="ml-1" size={15} />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 text-gray-500" size={15} /> Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 text-gray-500" size={15} /> Desc
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility()}>
              <EyeOff className="mr-2 text-gray-500" size={15} /> Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default ColumnHeader;
