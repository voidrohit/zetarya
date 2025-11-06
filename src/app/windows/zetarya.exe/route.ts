import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.redirect(
        'https://zetaryacreator.s3.ap-south-1.amazonaws.com/0.3.5/zetarya.pkg',
        { status: 302 }
    );
}
