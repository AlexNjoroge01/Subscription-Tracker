import { NextResponse } from 'next/server'

/**
 * Success response helper
 */
export function success<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status })
}

/**
 * Error response helper
 */
export function error(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status })
}

/**
 * Unauthorized response
 */
export function unauthorized(message = 'Unauthorized') {
    return NextResponse.json({ success: false, error: message }, { status: 401 })
}

/**
 * Not found response
 */
export function notFound(message = 'Resource not found') {
    return NextResponse.json({ success: false, error: message }, { status: 404 })
}

/**
 * Validation error response
 */
export function validationError(errors: Record<string, string[]>) {
    return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
    )
}
