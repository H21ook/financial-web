import { NextResponse } from "next/server";
import { setTokens } from "@/lib/tokens";
import { Roles } from "@/types/auth.types";

export async function POST(req: Request) {
  const { userId, password, role } = await req.json();

  let loginEndpoint = Roles.SYSTEM_ADMIN === role ? '/auth/sysadmin' : '/auth/accountant';

  const deviceId = req.headers.get("x-device-id");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${loginEndpoint}`, {
    method: "POST",
    body: JSON.stringify({
      UserName: userId.trim(),
      PasswordHash: password.trim()
    }),
    headers: { "Content-Type": "application/json", "x-device-id": deviceId || "" },
  });

  if (!res.ok) {
    if (res.status === 401)
      return NextResponse.json({ error: "Нэвтрэх нэр эсвэл нууц үг буруу байна." }, { status: 401 });

    return NextResponse.json({ error: 'Нэвтрэх үйлдэл амжилтгүй боллоо.' }, { status: res.status });
  }

  const resData = await res.json();
  const { token, data: userData } = resData;
  await setTokens(token, userData);

  return NextResponse.json({ userData, token });
}
