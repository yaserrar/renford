// export { auth as middleware } from "@/auth";
import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {};
