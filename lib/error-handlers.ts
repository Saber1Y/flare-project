import { NextResponse } from "next/server";

export function withTimeout(promise: Promise<any>, timeoutMs: number = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
}

export function handleDbError(error: any, context: string) {
  console.error(`Database error in ${context}:`, error);
  
  if (error.code === 'CONNECT_TIMEOUT' || error.code === 'ECONNRESET') {
    return NextResponse.json(
      { 
        error: "Database temporarily unavailable", 
        retryAfter: 30,
        context 
      },
      { status: 503 }
    );
  }
  
  return NextResponse.json(
    { error: "Database operation failed", context },
    { status: 500 }
  );
}