import { NextRequest } from 'next/server';
import { AuthController } from '../../../../lib/controllers/AuthController';

export async function GET(request: NextRequest) {
  return await AuthController.getProfile(request);
}
