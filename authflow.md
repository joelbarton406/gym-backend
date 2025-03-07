1. fill out form on frontend with credentials

```typescript
{
    email: "joel@gmail.com",
    password : "Asdfjkl;1"
}
```

2. `onSubmit` issues POST request:

```typescript
const res = await fetch("http://localhost:3000/api/auth/login", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ ...formData }),
});
```

3. at `localhost:3000` in index.ts, the path `/api/auth` is handled by the `authRouter`

```typescript
import express from "express";
import { authenticateSession } from "../middleware/auth.middleware";
import { signup, login, logout } from "../controllers/auth.controller";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", authenticateSession, logout);
authRouter.all("*", (req, res) => {
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const blue = "\x1b[34m";
  const pink = "\x1b[35m";
  const reset = "\x1b[0m"; // Reset color
  console.log(
    `${red}invalid route: ${green}${req.method} ${blue}${req.path}${reset}`
  );
  res.sendStatus(404);
});
export default authRouter;
```

4. `/signup` is handled by the `signup` function

```typescript
export const signup = async (req: Request, res: Response) => {
  try {
    const rawMember: RawMember = validate(req.body, memberSignupSchema);
    await authService.signup(rawMember);

    const { sessionId, expiresAt, member } = await authService.login({
      email: rawMember.email,
      password: rawMember.password,
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
      // For local development, explicitly set domain to match your API
      domain: "localhost",
    });

    res.status(201).json({ member });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
```

5. which relies on `validate` to validate the input and `authService.login` to interact with the database using drizzle and bcrypt to ensure the credentials are valid and the user exists. Importantly, the auth.service login function checks if there is an existing session associated with the member_id. :

```typescript
export const login = async (credentials: Credentials) => {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, credentials.email))
    .limit(1);

  if (!member) {
    throw new Error("Invalid credentials, email not found");
  }

  const passwordsMatch = await bcrypt.compare(
    credentials.password,
    member.password
  );

  if (!passwordsMatch) {
    throw new Error("Invalid credentials, incorrect password");
  }

  const [existingSession] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.member_id, member.id))
    .limit(1);

  if (existingSession) {
    await db
      .delete(sessions)
      .where(
        and(
          eq(sessions.id, existingSession.id),
          eq(sessions.member_id, member.id)
        )
      );
  }
  const sessionId = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  const createdAt = new Date(Date.now());
  const [session] = await db
    .insert(sessions)
    .values({
      id: sessionId,
      member_id: member.id,
      expires_at: expiresAt,
      created_at: createdAt,
    })
    .returning();

  console.log({ session });
  return {
    sessionId: session.id,
    expiresAt,
    member: {
      id: member.id,
      email: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      phoneNumber: member.phone_number,
      profileType: member.profile_type,
    },
  };
};
```

6. back in `auth.controller`, the authService.login should return the `sessionId`, `expiresAt`, and `member`:

```typescript
export const login = async (req: Request, res: Response) => {
  try {
    const credentials: Credentials = validate(req.body, memberLoginSchema);
    console.log("credentials validated");
    const { sessionId, expiresAt, member } = await authService.login(
      credentials
    );

    // Instead of using res.cookie
    res.setHeader("Set-Cookie", [
      `sessionId=${sessionId}; HttpOnly; Path=/; SameSite=None; Expires=${expiresAt.toUTCString()}`,
    ]);

    res.status(200).json({ member });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
```

7. importantly, the session Id needs to be wrapped in a cookie and part of the response sent back to the client (currently im trying to use the `"Set-Cookie"` header)
8. once `res.status(200).json({member})` returns back to the client, when I inspect the headers of the response, I can see the sessionId in the Set-Cookie:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin, Accept-Encoding
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: *,Authorization
Set-Cookie: sessionId=c132ad2eb5734b0022eef880f3252b4e1e49abb82f25128f52aead561e6c60a2; HttpOnly; Path=/; SameSite=None; Expires=Fri, 07 Mar 2025 03:09:16 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 132
ETag: W/"84-e7uDUdUhUEONMK1w270BPJuga6s"
Date: Fri, 07 Mar 2025 02:59:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

9. in the frontend, upon successful receival of a response in the login form, the code checks if `member` is not undefined, if it's not undefined it navigates to the member's page:

```typescript
const res = await fetch("http://localhost:3000/api/auth/login", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ ...formData }),
});

const { member } = await res.json();
if (member) {
  navigate(`member/${member.id}`);
}
```

10. upon invocation, the following react code is executed/loaded/rendered:

```typescript
// Profile.tsx
import { base_url } from "@/config";
import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";

export type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_type: "admin" | "client" | "staff";
};

export const memberLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<Member> => {
  const memberId = params.memberId;
  const res = await fetch(`${base_url}/members/${memberId}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load profile: ${res.status}`);
  }

  const member = await res.json();
  console.log("member from memberLoader: ", JSON.stringify(member));
  return member;
};

export default function Member() {
  const member = useLoaderData() as Member;

  return (
    <div>
      <h1>Member Profile</h1>
      {member ? (
        <div>
          <p>Welcome, {member.first_name}!</p>
          {/* Display other member details */}
        </div>
      ) : (
        <p>No member data available.</p>
      )}
    </div>
  );
}
```

11. most consequentially, the loader functions fetches data from the backend and _should_ have the cookie with the session id on it.

```typescript
const res = await fetch(`${base_url}/members/${memberId}`, {
  credentials: "include",
  headers: {
    Accept: "application/json",
  },
});
```

12. However that doesn't seem to be the case based on the following on the backend, `index.ts`: `app.use("/api/members", authenticateSession, memberRouter);` where authenticateSession is:

```typescript
export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies.sessionId;
  console.log(req.cookies);

  if (!sessionId) {
    res.status(401).send("Unauthorized: No sessionId cookie found");
    return;
  }

  // basic token verification
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expires_at, new Date())))
    .limit(1);

  if (!session) {
    res.status(401).json({ message: "Invalid or expired session" });
    return;
  }

  next();
};
```

13. and the response the client gets is this:

```
GET /api/members/2 HTTP/1.1
Accept: application/json
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en-US,en;q=0.9
Cache-Control: no-cache
Connection: keep-alive
Cookie: phpMyAdmin=64f8eb0d5e0ecfdbdeb424785b0874fc; pmaAuth-1=iewUEttWTBtHfYR9S62gJQiZwAyCSbCZeBt1kEZ%2Fw27hi%2BSIvtsfRRk3BfFV2tyLMU5BFJClvB5Yn9Sa2TRHFq8lIkb5ZQEUiFh2QYE2EZkfQIkOvh8fdZrO; wordpress_test_cookie=WP%20Cookie%20check; wordpress_logged_in_8dec71ede39ad9ff3b3fbc03311bdc45=admin%7C1722549683%7C1zVVuIZPAekWzgDSrL2iuhzGcJE62clu0XAAxDIr402%7Ce23000a67a025e0aeb7b0a20ef0f44c0859f6ae1ec91d68f3582ccb4ef3c9262; wp-settings-time-1=1722376922
DNT: 1
Host: localhost:3000
Origin: http://localhost:5173
Pragma: no-cache
Referer: http://localhost:5173/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36
sec-ch-ua: "Chromium";v="133", "Not(A:Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "macOS"
```
