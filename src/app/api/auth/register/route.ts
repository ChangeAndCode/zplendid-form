import { NextRequest } from 'next/server';
import { AuthController } from '../../../../lib/controllers/AuthController';

export async function POST(request: NextRequest) {
  return await AuthController.register(request);
}
