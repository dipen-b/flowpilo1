import { NextResponse } from "next/server";
import { getMembers } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getMembers());
}
