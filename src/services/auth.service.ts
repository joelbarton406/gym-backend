import { RawMember, db, members, sessions, Credentials } from "../db";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
const SALT_ROUNDS = 12;
const SESSION_DURATION = 10 * 60 * 1000; // 10 minute sessions

export const signup = async (rawMember: RawMember) => {
  const [existingMember] = await db
    .select()
    .from(members)
    .where(eq(members.email, rawMember.email))
    .limit(1);

  if (existingMember) {
    throw new Error("Email already in use");
  }

  const hashed_password = await bcrypt.hash(
    rawMember.plaintext_password,
    SALT_ROUNDS
  );

  const [member] = await db
    .insert(members)
    .values({
      ...rawMember,
      hashed_password,
      created_at: new Date().toISOString(),
    })
    .returning({
      id: members.id,
      email: members.email,
      hashed_password: members.hashed_password,
      created_at: members.created_at,
      phone_number: members.phone_number,
      first_name: members.first_name,
      last_name: members.last_name,
      profile_type: members.profile_type,
    });

  return member;
};

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
    credentials.plaintext_password,
    member.hashed_password
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

  return {
    sessionId: session.id,
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

export const logout = async (sessionId: string) => {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
};
