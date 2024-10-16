import Store from "@/app/utils/stores/store";
import { NextResponse, NextRequest } from "next/server";

const store = new Store();

export async function POST(req: NextRequest) {
    try {

    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}