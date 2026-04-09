import { NextResponse } from 'next/server';

export function proxy(request) {
    const path = request.nextUrl.pathname;

    // 1. Get Role from Cookie (Mock)
    const roleCookie = request.cookies.get('user_role');
    const role = roleCookie?.value || 'GUEST';

    console.log(`[Proxy] Path: ${path} | Role: ${role}`);

    // 2. Define Protected Areas
    const isHQ = path.startsWith('/dashboard/hq');
    const isClientDashboard = path.startsWith('/dashboard') && !isHQ;
    const isWorkstation = path.startsWith('/workstation');

    // 3. ENFORCE RULES

    // RULE A: Guests cannot enter protected areas
    if ((isHQ || isClientDashboard || isWorkstation) && role === 'GUEST') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // RULE B: Creates CANNOT enter Client Dashboard or HQ
    if ((isClientDashboard || isHQ) && role.startsWith('CREATIVE_')) {
        // Allow them to go to their workstation, redirect if they try to access dashboard
        return NextResponse.redirect(new URL('/workstation/' + role.split('_')[1].toLowerCase(), request.url));
    }

    // RULE C: Clients CANNOT enter HQ (Workstations are now accessible for visual check)
    if (isHQ && role === 'CLIENT') {
        // SILENT REDIRECT: Send them back to their dashboard, so they don't know HQ exists.
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // RULE D: Admin can go anywhere (God Mode)
    if (role === 'ADMIN') {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/workstation/:path*', '/admin/:path*'],
};
