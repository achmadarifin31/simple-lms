import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { logger } from './logger';

/**
 * Standardised API response helpers.
 * Use these in every Route Handler so response shape is always consistent.
 *
 * SUCCESS:  { data: T }
 * ERROR:    { error: { code, message, details? } }
 */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

/**
 * Central error → response mapper. Call this in the catch block of every
 * Route Handler. Services/repositories just throw; they never format responses.
 */
export function handleError(err: unknown) {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      { status: err.statusCode }
    );
  }

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: err.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  logger.error('Unhandled error', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
    { status: 500 }
  );
}
